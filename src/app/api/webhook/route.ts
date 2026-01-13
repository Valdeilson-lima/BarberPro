import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe";
import { manageSubscription } from "@/utils/manage-subscription";
import { Plan } from "@/generated/prisma/browser";


export const POST = async (request: Request) => {
  const signature = request.headers.get("Stripe-Signature")!;

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  console.log("Recebido webhook do Stripe");
  const text = await request.text();

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_SECRET_WEBHOOK_KEY as string
  );

  switch (event.type) {
    case "customer.subscription.deleted":
      const payment = event.data.object as Stripe.Subscription;

      await manageSubscription(
        payment.id,
        payment.customer.toString(),
        false,
        true
      );
      console.log("Assinatura deletada:", payment);

      break;
    case "customer.subscription.updated":
      const paymentIntent = event.data.object as Stripe.Subscription;
      await manageSubscription(
        paymentIntent.id,
        paymentIntent.customer.toString(),
        false
      );
      console.log("Assinatura atualizada:", paymentIntent);

      break;
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const type = checkoutSession?.metadata?.type
        ? checkoutSession.metadata.type
        : "BASIC";

      if (checkoutSession.subscription && checkoutSession.customer) {
        await manageSubscription(
          checkoutSession.subscription!.toString(),
          checkoutSession.customer!.toString(),
          true,
          false,
          type as Plan
        );
        console.log("Assinatura criada via checkout:", checkoutSession);
      }

      break;
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
};
