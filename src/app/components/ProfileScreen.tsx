import React from 'react';
import { ArrowLeft, User, Mail, LogOut, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Screen } from '../App';
import { User as UserType } from '../App';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  user: UserType;
  onLogout: () => void;
}

export default function ProfileScreen({ onNavigate, user, onLogout }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          <h1 className="text-xl font-bold text-gray-900">Perfil</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* User Avatar Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white/20 p-6 rounded-full mb-4">
              <User className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-blue-100">{user.email}</p>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="bg-green-100 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Correo electrónico</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">ID de usuario</p>
                <p className="font-mono text-xs text-gray-600">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>Acerca de la aplicación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              GastosApp te ayuda a llevar un control simple y efectivo de tus gastos personales diarios.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Versión: 1.0.0</p>
              <p>Desarrollado para control de gastos personales</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 py-6 text-lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
