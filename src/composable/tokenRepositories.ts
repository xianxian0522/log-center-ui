import router from "@/router";

export default function tokenRepositories(token: string) {
  if (token) {
    localStorage.setItem('token', token)
    router.push({name: 'log'}).then()
  }
}
