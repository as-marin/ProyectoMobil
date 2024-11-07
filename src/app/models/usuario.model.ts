export interface User{
uid: string,
email: string,
password: string,
nombre: string,
apellido: string,
role: 'estudiante' | 'profesor';
}