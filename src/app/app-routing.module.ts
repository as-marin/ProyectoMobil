import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from "../app/guards/role.guard";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'bienvenida',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/formularios/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/formularios/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./pages/welcomes/bienvenida/bienvenida.module').then( m => m.BienvenidaPageModule)
  },
  {
    path: 'elegir',
    loadChildren: () => import('./pages/formularios/elegir/elegir.module').then( m => m.ElegirPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/perfiles/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/perfiles/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/menus/inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [RoleGuard],
    data: { role: 'estudiante' }
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/menus/config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'recuperarpw',
    loadChildren: () => import('./pages/formularios/recuperarpw/recuperarpw.module').then( m => m.RecuperarpwPageModule)
  },
  {
    path: 'teacher',
    loadChildren: () => import('./pages/perfiles/teacher/teacher.module').then( m => m.TeacherPageModule),
    canActivate: [RoleGuard],
    data: { role: 'profesor' } // Solo accesible para el rol 'profesor'
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./pages/menus/asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/funcionalidades/scanner/scanner.module').then( m => m.ScannerPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./pages/menus/scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'horario',
    loadChildren: () => import('./pages/menus/horario/horario.module').then( m => m.HorarioPageModule)
  },

  



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
