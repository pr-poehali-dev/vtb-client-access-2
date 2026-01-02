import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { type Card as CardType } from '@/pages/Index';

type PaymentType = 'card' | 'phone' | 'requisites' | 'utilities' | 'mobile' | 'internet';

type PaymentModalProps = {
  type: PaymentType;
  cards: CardType[];
  onClose: () => void;
};

const paymentTitles: Record<PaymentType, string> = {
  card: 'Перевод по номеру карты',
  phone: 'Перевод по номеру телефона',
  requisites: 'Перевод по реквизитам',
  utilities: 'Оплата коммунальных услуг',
  mobile: 'Пополнение мобильного телефона',
  internet: 'Оплата интернета и ТВ'
};

const PaymentModal = ({ type, cards, onClose }: PaymentModalProps) => {
  const [selectedCard, setSelectedCard] = useState(cards[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Укажите корректную сумму');
      return;
    }

    if (!recipient) {
      toast.error('Укажите получателя');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      toast.success('Платёж выполнен успешно', {
        description: `Списано ${amount} ₽`
      });
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  const formatCardNumber = (number: string) => {
    return `**** ${number.slice(-4)}`;
  };

  const getRecipientLabel = () => {
    switch (type) {
      case 'card':
        return 'Номер карты получателя';
      case 'phone':
        return 'Номер телефона';
      case 'requisites':
        return 'Номер счёта';
      case 'utilities':
        return 'Лицевой счёт';
      case 'mobile':
        return 'Номер телефона';
      case 'internet':
        return 'Номер договора';
      default:
        return 'Получатель';
    }
  };

  const getRecipientPlaceholder = () => {
    switch (type) {
      case 'card':
        return '1234567890123456';
      case 'phone':
        return '+7 999 123-45-67';
      case 'requisites':
        return '40817810099910004312';
      case 'utilities':
        return '123456789';
      case 'mobile':
        return '+7 999 123-45-67';
      case 'internet':
        return '9876543210';
      default:
        return '';
    }
  };

  const selectedCardData = cards.find(c => c.id === selectedCard);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{paymentTitles[type]}</CardTitle>
              <CardDescription className="mt-1">Заполните данные для перевода</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card">Списать с карты</Label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger id="card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {formatCardNumber(card.number)} • {card.balance.toLocaleString('ru-RU')} ₽
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">{getRecipientLabel()}</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={getRecipientPlaceholder()}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Сумма</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₽
                </span>
              </div>
              {selectedCardData && (
                <p className="text-xs text-muted-foreground">
                  Доступно: {selectedCardData.balance.toLocaleString('ru-RU')} ₽
                </p>
              )}
            </div>

            <div className="pt-4 space-y-2">
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                    Обработка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2" size={20} />
                    Перевести
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={onClose}>
                Отмена
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Icon name="Shield" size={14} />
              <span>Защищённая транзакция</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;
