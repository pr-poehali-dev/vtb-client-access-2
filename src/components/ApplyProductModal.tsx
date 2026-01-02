import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type ProductType = 'debit' | 'credit' | 'savings' | 'loan';

type ApplyProductModalProps = {
  type: ProductType;
  onClose: () => void;
};

const productInfo: Record<ProductType, { title: string; description: string; benefit: string }> = {
  debit: {
    title: 'Дебетовая карта',
    description: 'Кешбэк до 30% на всё',
    benefit: '0 ₽ за обслуживание'
  },
  credit: {
    title: 'Кредитная карта',
    description: 'До 200 дней без процентов',
    benefit: 'Лимит до 1 000 000 ₽'
  },
  savings: {
    title: 'Накопительный счёт',
    description: 'До 18% годовых',
    benefit: 'Пополнение и снятие без ограничений'
  },
  loan: {
    title: 'Кредит наличными',
    description: 'Ставка от 5.9%',
    benefit: 'До 5 000 000 ₽'
  }
};

const ApplyProductModal = ({ type, onClose }: ApplyProductModalProps) => {
  const [formData, setFormData] = useState({
    phone: '',
    income: '',
    agree: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const product = productInfo[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Укажите корректный номер телефона');
      return;
    }

    if (!formData.agree) {
      toast.error('Необходимо согласие на обработку данных');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      toast.success('Заявка принята!', {
        description: 'Мы свяжемся с вами в течение 15 минут'
      });
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{product.title}</CardTitle>
              <CardDescription className="mt-1">{product.description}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Icon name="Gift" size={20} />
              <span>{product.benefit}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 999 123-45-67"
                required
              />
              <p className="text-xs text-muted-foreground">
                Мы перезвоним для подтверждения заявки
              </p>
            </div>

            {(type === 'credit' || type === 'loan') && (
              <div className="space-y-2">
                <Label htmlFor="income">Ежемесячный доход</Label>
                <div className="relative">
                  <Input
                    id="income"
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    placeholder="50000"
                    min="0"
                    required
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₽
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={formData.agree}
                onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                className="mt-1"
                required
              />
              <Label htmlFor="agree" className="text-xs leading-relaxed cursor-pointer">
                Я согласен на обработку персональных данных и получение информации о продуктах и услугах ВТБ
              </Label>
            </div>

            <div className="pt-4 space-y-2">
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Check" className="mr-2" size={20} />
                    Оформить заявку
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={onClose}>
                Отмена
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Рассмотрение заявки: до 2 минут</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Shield" size={14} />
                <span>Ваши данные защищены</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplyProductModal;
