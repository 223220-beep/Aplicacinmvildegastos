import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Screen, Expense } from '../App';
import { projectId } from '/utils/supabase/info';
import { toast } from 'sonner';

interface ExpensesListScreenProps {
  onNavigate: (screen: Screen) => void;
  accessToken: string;
  onExpenseSelect: (expense: Expense) => void;
}

export default function ExpensesListScreen({ 
  onNavigate, 
  accessToken, 
  onExpenseSelect 
}: ExpensesListScreenProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [searchQuery, expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa79c66d/expenses`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al cargar gastos');
        return;
      }

      setExpenses(data.expenses);
      setFilteredExpenses(data.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    if (!searchQuery.trim()) {
      setFilteredExpenses(expenses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
    );
    setFilteredExpenses(filtered);
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
      month: 'long',
      year: 'numeric'
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

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          <h1 className="text-xl font-bold text-gray-900">Todos los gastos</h1>
          <div className="w-20"></div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar gastos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-6">
        <p className="text-blue-100 text-sm">Total de gastos</p>
        <p className="text-3xl font-bold mt-1">
          {formatCurrency(getTotalAmount())}
        </p>
        <p className="text-blue-100 text-sm mt-2">
          {filteredExpenses.length} {filteredExpenses.length === 1 ? 'gasto' : 'gastos'}
        </p>
      </div>

      {/* Expenses List */}
      <div className="flex-1 px-6 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery ? 'No se encontraron gastos' : 'No hay gastos registrados'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery
                  ? 'Intenta con otra búsqueda'
                  : 'Agrega tu primer gasto para comenzar'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <Card
                key={expense.id}
                className="hover:shadow-md transition cursor-pointer"
                onClick={() => onExpenseSelect(expense)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
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
                    <div className="text-right ml-4">
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

      {/* Add Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => onNavigate('add-expense')}
          className="bg-blue-600 hover:bg-blue-700 rounded-full w-14 h-14 shadow-lg"
        >
          <span className="text-2xl">+</span>
        </Button>
      </div>
    </div>
  );
}
