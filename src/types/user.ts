export type UserRole = 'admin' | 'organizer' | 'participant'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  token?: string
}
