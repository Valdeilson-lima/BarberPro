import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { stripe } from "./stripe";
import { Plan } from "@/generated/prisma/enums";
import { de, pl } from "date-fns/locale";

/**
 * Salva ou atualiza a assinatura do usuário no banco de dados e sincroniza com o Stripe.
 * @async
 * @function manageSubscription
 * @param {string} subscriptionId - ID da assinatura no Stripe
 * @param {string} customerId - ID do cliente no Stripe
 * @param {boolean} createAction - Indica se é uma ação de criação
 * @param {boolean} deleteAction - Indica se é uma ação de exclusão
 * @param {Plan} [type] - Tipo do plano
 * @returns {Promise<void>} - Retorna uma Promise que resolve quando a operação é concluída
 */
export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
  deleteAction = false,
  type?: Plan
) {
  const findUser = await prisma.user.findFirst({
    where: {
      stripeCustomerId: customerId,
    },
  });

  if (!findUser) {
    return Response.json(
      { error: "Usuário não encontrado para o cliente Stripe fornecido." },
      { status: 404 }
    );
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: findUser.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type || Plan.BASIC,
  };

  if (subscriptionId && deleteAction) {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });
    return;
  }

  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData,
      });
    } catch (error) {
      return Response.json(
        { error: "Erro ao criar assinatura." },
        { status: 500 }
      );
    }
  } else {
    try {
      const findSubscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
        },
      });

      if (!findSubscription) {
        return Response.json(
          { error: "Assinatura não encontrada." },
          { status: 404 }
        );
      }

      await prisma.subscription.update({
        where: {
          id: findSubscription.id,
        },
        data: {
          status: subscriptionData.status,
          priceId: subscription.items.data[0].price.id,
        },
      });
    } catch (error) {
      return Response.json(
        { error: "Erro ao atualizar assinatura." },
        { status: 500 }
      );
    }
  }
}
