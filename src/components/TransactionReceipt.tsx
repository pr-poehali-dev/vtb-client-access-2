import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type TransactionReceiptProps = {
  transaction: {
    id: string;
    date: Date;
    amount: number;
    recipient: string;
    senderCard: string;
    status: 'success' | 'pending' | 'failed';
  };
  onClose: () => void;
};

const TransactionReceipt = ({ transaction, onClose }: TransactionReceiptProps) => {
  const formatCardNumber = (number: string) => {
    return `**** ${number.slice(-4)}`;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Чек отправлен на печать');
  };

  const handleDownload = () => {
    const receiptText = `
БАРСИК БАНК 🐱
Чек операции

Дата: ${formatDate(transaction.date)}
Номер операции: ${transaction.id}

С карты: ${formatCardNumber(transaction.senderCard)}
Получатель: ${transaction.recipient}
Сумма: ${formatAmount(transaction.amount)} ₽

Статус: ${transaction.status === 'success' ? 'Выполнено' : transaction.status === 'pending' ? 'В обработке' : 'Ошибка'}

Спасибо за использование Барсик Банка!
Горячая линия: 8 800 МЯУ-БАРС (692-2277)
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Чек скачан');
  };

  const statusConfig = {
    success: { text: 'Выполнено', color: 'text-green-600', icon: 'CheckCircle2' as const },
    pending: { text: 'В обработке', color: 'text-yellow-600', icon: 'Clock' as const },
    failed: { text: 'Ошибка', color: 'text-red-600', icon: 'XCircle' as const }
  };

  const status = statusConfig[transaction.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in print:shadow-none">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐱</span>
              <CardTitle>Чек операции</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="print:hidden">
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
            transaction.status === 'success' ? 'bg-green-50 border-green-200' :
            transaction.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <Icon name={status.icon} size={24} className={status.color} />
            <span className={`font-semibold ${status.color}`}>{status.text}</span>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Дата операции</span>
              <span className="font-medium">{formatDate(transaction.date)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Номер операции</span>
              <span className="font-mono text-sm">{transaction.id}</span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="text-muted-foreground">С карты</span>
              <span className="font-medium">{formatCardNumber(transaction.senderCard)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Получатель</span>
              <span className="font-medium">{transaction.recipient}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg">
              <span className="font-semibold">Сумма перевода</span>
              <span className="text-2xl font-bold">{formatAmount(transaction.amount)} ₽</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-xs text-muted-foreground text-center">
            <p>Барсик Банк</p>
            <p>Горячая линия: 8 800 МЯУ-БАРС (692-2277)</p>
            <p className="flex items-center justify-center gap-1">
              <Icon name="Shield" size={12} />
              Операция защищена
            </p>
          </div>

          <div className="flex gap-2 pt-4 print:hidden">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Icon name="Printer" className="mr-2" size={18} />
              Печать
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Icon name="Download" className="mr-2" size={18} />
              Скачать
            </Button>
          </div>

          <Button className="w-full print:hidden" onClick={onClose}>
            Закрыть
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionReceipt;
