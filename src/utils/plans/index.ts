
export type PlanDetailsProps = {
    maxServices: number;
}

export type PlansProps ={
    BASIC: PlanDetailsProps;
    PROFESSIONAL: PlanDetailsProps;
}

export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50,
  },
};

export const subscriptionPlans = [
  {
    id: "BASIC",
    name: "Básico",
    description: "Perfeito para pequenas barbearias ou salões de beleza que estão começando.",
    olPrice: 29.99,
    price: 19.99,
    features: [
      "Até 3 serviços cadastrados",
      "Acesso ao suporte via e-mail",
      "Relatórios básicos de desempenho",
    ],
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Ideal para barbearias ou salões de beleza de médio a grande porte.",
    olPrice: 99.99,
    price: 59.99,
    features: [
      "Até 50 serviços cadastrados",
      "Acesso ao suporte prioritário via e-mail e chat",
      "Relatórios avançados de desempenho",
      "Integração com ferramentas de marketing",
    ],
  },
];
