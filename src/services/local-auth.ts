import type { User } from '../domain';
import { ServiceError, type AuthService } from './contracts';

const sessionKey = 'idhn.auth.account';
const accounts = [
  { identifier: 'seller@example.test', password: 'Seller-4826', user: { id: 'seller_a', role: 'seller', name: 'متجر الخزف' } },
  { identifier: 'owner@example.test', password: 'Owner-4826', user: { id: 'usr_rh_001', role: 'rights_holder', name: 'نورة السالم' } },
  { identifier: 'reviewer@example.test', password: 'Review-4826', user: { id: 'usr_rev_001', role: 'reviewer', name: 'ريم الحربي' } },
] satisfies { identifier: string; password: string; user: User }[];

export function getLocalUser(): User | null {
  const id = sessionStorage.getItem(sessionKey);
  return accounts.find(account => account.user.id === id)?.user ?? null;
}

export const localAuth: AuthService = {
  async getCurrentUser() { return getLocalUser(); },
  async signIn({ identifier, password }) {
    const account = accounts.find(item => item.identifier === identifier.trim().toLowerCase() && item.password === password);
    if (!account) throw new ServiceError('invalid_credentials');
    sessionStorage.setItem(sessionKey, account.user.id);
    return account.user;
  },
  async signOut() {
    sessionStorage.removeItem(sessionKey);
  },
};
