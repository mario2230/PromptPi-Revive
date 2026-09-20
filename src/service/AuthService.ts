import { auth } from '@/main'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, updatePassword, onAuthStateChanged, User } from 'firebase/auth'

export async function cadastrar(email:string, senha:string){

    const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
    )

    return credential.user

}

export function logar(email:string, senha: string) {
    return signInWithEmailAndPassword(auth, email, senha)
}

export function logout() {
    return signOut(auth)
}

export async function atualizarPerfil(displayName:string){

    const user = auth.currentUser

    if(!user)
        throw new Error('Usuário não autenticado')

    await updateProfile(user,{
        displayName
    })

}

export function alternarSenha(novaSenha: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')
    return updatePassword(user, novaSenha)
}


export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}