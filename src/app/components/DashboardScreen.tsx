import React, { useState, useEffect } from 'react';
import { Plus, List, UserCircle, TrendingUp, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Screen, User, Expense } from '../App';
import { projectId } from '/utils/supabase/info';
import { toast } from 'sonner';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
  accessToken: string;
}

export default function DashboardScreen({ onNavigate, user, accessToken }: DashboardScreenProps) {
  const [totalMonth, setTotalMonth] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa79c66d/expenses/summary`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al cargar resumen');
        return;
      }

      setTotalMonth(data.totalMonth);
      setRecentExpenses(data.recentExpenses);
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Alimentos': 'bg-green-100 text-green-700',
      'Transporte': 'bg-blue-100 text-blue-700',
      'Entretenimiento': 'bg-purple-100 text-purple-700',
      'Salud': 'bg-red-100 text-red-700',
      'Servicios': 'bg-yellow-100 text-yellow-700',
      'Otros': 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-blue-100 text-sm">Bienvenido de nuevo</p>
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
          >
            <UserCircle className="w-8 h-8" />
          </button>
        </div>

        {/* Total Card */}
        <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total del mes</p>
                <p className="text-3xl font-bold">
                  {loading ? '...' : formatCurrency(totalMonth)}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onNavigate('add-expense')}
            className="bg-blue-600 hover:bg-blue-700 h-24 flex-col gap-2"
          >
            <Plus className="w-6 h-6" />
            <span>Agregar Gasto</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('expenses-list')}
            variant="outline"
            className="h-24 flex-col gap-2 border-2"
          >
            <List className="w-6 h-6" />
            <span>Ver Todos</span>
          </Button>
        </div>

        {/* Recent Expenses */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gastos recientes</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : recentExpenses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay gastos registrados</p>
                <p className="text-sm text-gray-400 mt-1">
                  Agrega tu primer gasto para comenzar
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <Card key={expense.id} className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {expense.description}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(expense.category)}`}>
                            {expense.category}
                          </span>
                          <span>•</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
