export type Tab = 'Início' | 'Histórico' | 'Registrar' | 'Resumo' | 'Perfil';
export type PageTab = Exclude<Tab, 'Registrar'>;

export const pageTabs: PageTab[] = ['Início', 'Histórico', 'Resumo', 'Perfil'];
export const pageSpring = { damping: 24, stiffness: 220, mass: 0.82 };
