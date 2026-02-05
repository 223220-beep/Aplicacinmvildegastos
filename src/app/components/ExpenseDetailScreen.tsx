import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, DollarSign, FileText, Tag, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Screen, Expense } from '../App';
import { projectId } from '/utils/supabase/info';
import { toast } from 'sonner';

interface ExpenseDetailScreenProps {
  onNavigate: (screen: Screen) => void;
  accessToken: string;
  expense: Expense;
}

const categories = [
  'Alimentos',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Servicios',
  'Otros',
];

export default function ExpenseDetailScreen({ 
  onNavigate, 
  accessToken, 
  expense 
}: ExpenseDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(new Date(expense.date).toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !category || !date) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('El monto debe ser mayor a cero');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa79c66d/expenses/${expense.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            description,
            amount: amountNumber,
            category,
            date: new Date(date).toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al actualizar gasto');
        return;
      }

      toast.success('¡Gasto actualizado exitosamente!');
      onNavigate('expenses-list');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa79c66d/expenses/${expense.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al eliminar gasto');
        return;
      }

      toast.success('¡Gasto eliminado exitosamente!');
      onNavigate('expenses-list');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
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
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Alimentos': 'bg-green-100 text-green-700 border-green-200',
      'Transporte': 'bg-blue-100 text-blue-700 border-blue-200',
      'Entretenimiento': 'bg-purple-100 text-purple-700 border-purple-200',
      'Salud': 'bg-red-100 text-red-700 border-red-200',
      'Servicios': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Otros': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('expenses-list')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          <h1 className="text-xl font-bold text-gray-900">Detalle del Gasto</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {!isEditing ? (
          /* View Mode */
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{expense.description}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monto</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Categoría</p>
                  <span className={`inline-block px-4 py-2 rounded-lg font-medium border ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha</p>
                  <p className="text-lg text-gray-900">{formatDate(expense.date)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Editar Gasto
              </Button>

              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 py-6 text-lg"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Eliminar Gasto
              </Button>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="description"
                  type="text"
                  placeholder="ej. Comida en restaurante"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select
                  value={category}
                  onValueChange={setCategory}
                  disabled={loading}
                >
                  <SelectTrigger id="category" className="pl-10">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-6"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El gasto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
