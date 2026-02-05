import React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { Screen } from '../App';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-full shadow-2xl">
            <Wallet className="w-20 h-20 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white">GastosApp</h1>
          <p className="text-blue-100 text-lg">
            Controla tus gastos personales de manera simple y efectiva
          </p>
        </div>

        <div className="space-y-4 pt-8 w-full max-w-sm mx-auto">
          <Button
            onClick={() => onNavigate('login')}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 text-lg font-semibold"
          >
            Iniciar sesión
          </Button>
          
          <Button
            onClick={() => onNavigate('register')}
            variant="outline"
            className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 py-6 text-lg font-semibold"
          >
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  );
}
