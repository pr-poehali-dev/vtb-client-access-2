import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { type Client } from '@/pages/Index';

type ClientManagementModalProps = {
  client: Client;
  onClose: () => void;
};

const ClientManagementModal = ({ client, onClose }: ClientManagementModalProps) => {
  const [limit, setLimit] = useState('100000');
  const [limitType, setLimitType] = useState<'daily' | 'monthly' | 'transaction'>('daily');
  const [blockReason, setBlockReason] = useState('');
  const [notification, setNotification] = useState('');

  const handleSetLimit = () => {
    toast.success('Лимит установлен', {
      description: `${limitType === 'daily' ? 'Дневной' : limitType === 'monthly' ? 'Месячный' : 'На транзакцию'} лимит: ${limit} ₽`
    });
  };

  const handleBlockCard = () => {
    if (!blockReason.trim()) {
      toast.error('Укажите причину блокировки');
      return;
    }
    
    toast.success('Карта заблокирована', {
      description: 'Клиент получит уведомление'
    });
  };

  const handleSendNotification = () => {
    if (!notification.trim()) {
      toast.error('Введите текст уведомления');
      return;
    }
    
    toast.success('Уведомление отправлено', {
      description: `Отправлено на ${client.email} и ${client.phone}`
    });
    setNotification('');
  };

  const handleIssueCredit = () => {
    toast.success('Кредит одобрен', {
      description: 'Заявка отправлена на рассмотрение'
    });
  };

  const formatCardNumber = (number: string) => {
    return `${number.slice(0, 4)} **** **** ${number.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-auto">
      <Card className="w-full max-w-3xl animate-scale-in my-8">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Управление клиентом</CardTitle>
              <CardDescription className="mt-1">{client.name}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Номер карты</p>
                <p className="font-medium font-mono">{formatCardNumber(client.cardNumber)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Телефон</p>
                <p className="font-medium">{client.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Клиент с</p>
                <p className="font-medium">{formatDate(client.registeredAt)}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="limits" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="limits">Лимиты</TabsTrigger>
              <TabsTrigger value="block">Блокировка</TabsTrigger>
              <TabsTrigger value="notify">Уведомления</TabsTrigger>
              <TabsTrigger value="products">Продукты</TabsTrigger>
            </TabsList>

            <TabsContent value="limits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Установить лимит</CardTitle>
                  <CardDescription>Управление лимитами по операциям</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Тип лимита</Label>
                      <Select value={limitType} onValueChange={(v) => setLimitType(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Дневной лимит</SelectItem>
                          <SelectItem value="monthly">Месячный лимит</SelectItem>
                          <SelectItem value="transaction">На транзакцию</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Сумма лимита</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={limit}
                          onChange={(e) => setLimit(e.target.value)}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">₽</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSetLimit} className="w-full">
                    <Icon name="Check" className="mr-2" size={18} />
                    Установить лимит
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="block" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Блокировка карты</CardTitle>
                  <CardDescription>Временная или постоянная блокировка</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Причина блокировки</Label>
                    <Textarea
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="Опишите причину блокировки карты..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleBlockCard} variant="destructive" className="w-full">
                    <Icon name="Ban" className="mr-2" size={18} />
                    Заблокировать карту
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Клиент получит уведомление о блокировке на email и телефон
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notify" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Отправить уведомление</CardTitle>
                  <CardDescription>Push, SMS и Email уведомления</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Текст уведомления</Label>
                    <Textarea
                      value={notification}
                      onChange={(e) => setNotification(e.target.value)}
                      placeholder="Введите текст сообщения для клиента..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendNotification} className="flex-1">
                      <Icon name="Send" className="mr-2" size={18} />
                      Отправить
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Mail" size={14} />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="MessageSquare" size={14} />
                      <span>SMS</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Bell" size={14} />
                      <span>Push</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Одобрить продукты</CardTitle>
                  <CardDescription>Быстрое одобрение кредитов и карт</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleIssueCredit} variant="outline" className="w-full justify-start h-auto py-4">
                    <Icon name="CreditCard" className="mr-3" size={24} />
                    <div className="text-left">
                      <p className="font-semibold">Кредитная карта</p>
                      <p className="text-xs text-muted-foreground">До 200 дней без процентов</p>
                    </div>
                  </Button>
                  <Button onClick={handleIssueCredit} variant="outline" className="w-full justify-start h-auto py-4">
                    <Icon name="Wallet" className="mr-3" size={24} />
                    <div className="text-left">
                      <p className="font-semibold">Кредит наличными</p>
                      <p className="text-xs text-muted-foreground">До 5 000 000 ₽ от 5.9%</p>
                    </div>
                  </Button>
                  <Button onClick={handleIssueCredit} variant="outline" className="w-full justify-start h-auto py-4">
                    <Icon name="PiggyBank" className="mr-3" size={24} />
                    <div className="text-left">
                      <p className="font-semibold">Накопительный счёт</p>
                      <p className="text-xs text-muted-foreground">До 18% годовых</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagementModal;
