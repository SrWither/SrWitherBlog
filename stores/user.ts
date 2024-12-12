import { defineStore } from 'pinia'
import type { User } from '~/api/users'

export const UserStore = defineStore('users', {
  state: (): { user: User | null } => ({ user: null }),
  actions: {
    setUser(user: User): void {
      this.user = user
    },

    clearProfile(): void {
      this.user = null
    }
  }
})