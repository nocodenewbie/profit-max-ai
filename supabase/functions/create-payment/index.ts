import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    console.log(`Creating payment for user: ${user.id}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Existing Stripe customer found: ${customerId}`);
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
      console.log(`New Stripe customer created: ${customerId}`);
    }

    // Create Payment Intent for embedded checkout
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 48900, // R$ 489.00 in cents
      currency: "brl",
      customer: customerId,
      metadata: {
        user_id: user.id,
        email: user.email,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`Payment Intent created: ${paymentIntent.id}`);

    // Record payment in database
    const { error: dbError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount: 48900,
        currency: 'brl',
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: customerId,
      });

    if (dbError) {
      console.error('Error creating payment record:', dbError);
    }

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
