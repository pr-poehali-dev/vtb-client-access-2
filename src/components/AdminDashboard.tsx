import { useState } from 'react';
import CallClientModal from '@/components/CallClientModal';
import ClientManagementModal from '@/components/ClientManagementModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { type LoginAttempt, type Card as CardType, type Client } from '@/pages/Index';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type AdminDashboardProps = {
  loginAttempts: LoginAttempt[];
  cards: CardType[];
  clients: Client[];
  onLogout: () => void;
  onBlockCard: (cardId: string) => void;
  onReissueCard: (cardId: string) => void;
};

const AdminDashboard = ({ 
  loginAttempts, 
  cards, 
  clients, 
  onLogout, 
  onBlockCard,
  onReissueCard 
}: AdminDashboardProps) => {
  const [actionCard, setActionCard] = useState<CardType | null>(null);
  const [actionType, setActionType] = useState<'block' | 'reissue' | null>(null);
  const [callClient, setCallClient] = useState<Client | null>(null);
  const [manageClient, setManageClient] = useState<Client | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatCardNumber = (number: string) => {
    return `${number.slice(0, 4)} ${number.slice(4, 8)} ${number.slice(8, 12)} ${number.slice(12)}`;
  };

  const suspiciousAttempts = loginAttempts.filter(a => a.suspicious);
  const successfulLogins = loginAttempts.filter(a => a.success);

  const handleCardAction = (card: CardType, action: 'block' | 'reissue') => {
    setActionCard(card);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!actionCard || !actionType) return;

    if (actionType === 'block') {
      onBlockCard(actionCard.id);
      toast.success(
        actionCard.status === 'blocked' 
          ? 'Карта разблокирована' 
          : 'Карта заблокирована'
      );
    } else if (actionType === 'reissue') {
      onReissueCard(actionCard.id);
      toast.success('Запущен процесс перевыпуска карты');
    }

    setActionCard(null);
    setActionType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐱</span>
            <div>
              <h1 className="text-2xl font-bold">Барсик Банк — Сотрудники</h1>
              <p className="text-gray-300 text-sm">Панель управления и контроля</p>
            </div>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={onLogout}>
            <Icon name="LogOut" className="mr-2" size={20} />
            Выход
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Всего попыток входа</CardTitle>
              <Icon name="Activity" className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loginAttempts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Успешных: {successfulLogins.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Подозрительные действия</CardTitle>
              <Icon name="AlertTriangle" className="text-orange-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{suspiciousAttempts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Требуют внимания
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Активные карты</CardTitle>
              <Icon name="CreditCard" className="text-green-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {cards.filter(c => c.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Заблокированных: {cards.filter(c => c.status === 'blocked').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attempts" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 h-12">
            <TabsTrigger value="attempts" className="flex items-center gap-2">
              <Icon name="FileText" size={18} />
              <span className="hidden sm:inline">Логи</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Icon name="CreditCard" size={18} />
              <span className="hidden sm:inline">Карты</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Icon name="Users" size={18} />
              <span className="hidden sm:inline">Клиенты</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Icon name="BarChart3" size={18} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Icon name="FileSpreadsheet" size={18} />
              <span className="hidden sm:inline">Отчёты</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attempts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Все попытки входа</CardTitle>
                <CardDescription>
                  Полный журнал активности с отметкой подозрительных действий
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата и время</TableHead>
                        <TableHead>Номер карты</TableHead>
                        <TableHead>IP-адрес</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Риск</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loginAttempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell className="font-mono text-sm">
                            {formatDate(attempt.timestamp)}
                          </TableCell>
                          <TableCell className="font-mono">
                            {attempt.cardNumber}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {attempt.ipAddress}
                          </TableCell>
                          <TableCell>
                            <Badge variant={attempt.success ? 'default' : 'destructive'}>
                              {attempt.success ? 'Успешно' : 'Отклонено'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {attempt.suspicious && (
                              <Badge variant="outline" className="text-orange-500 border-orange-500">
                                <Icon name="AlertCircle" size={14} className="mr-1" />
                                Подозрительно
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards">
            <Card>
              <CardHeader>
                <CardTitle>Управление картами</CardTitle>
                <CardDescription>
                  Блокировка, разблокировка и перевыпуск карт
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {cards.map((card, index) => (
                      <div key={card.id}>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon name="CreditCard" size={24} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-mono font-semibold">
                                {formatCardNumber(card.number)}
                              </p>
                              <p className="text-sm text-muted-foreground">{card.holder}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={card.type === 'debit' ? 'default' : 'secondary'}>
                                  {card.type === 'debit' ? 'Дебетовая' : 'Кредитная'}
                                </Badge>
                                <Badge 
                                  variant={
                                    card.status === 'active' ? 'outline' : 
                                    card.status === 'blocked' ? 'destructive' : 
                                    'secondary'
                                  }
                                >
                                  {card.status === 'active' ? 'Активна' : 
                                   card.status === 'blocked' ? 'Заблокирована' : 
                                   'Перевыпуск'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={card.status === 'blocked' ? 'default' : 'destructive'}
                              size="sm"
                              onClick={() => handleCardAction(card, 'block')}
                              disabled={card.status === 'reissuing'}
                            >
                              <Icon 
                                name={card.status === 'blocked' ? 'Unlock' : 'Lock'} 
                                size={16} 
                                className="mr-1" 
                              />
                              {card.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCardAction(card, 'reissue')}
                              disabled={card.status === 'reissuing'}
                            >
                              <Icon name="RefreshCw" size={16} className="mr-1" />
                              Перевыпустить
                            </Button>
                          </div>
                        </div>
                        {index < cards.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>База клиентов</CardTitle>
                <CardDescription>
                  Информация о клиентах банка
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {clients.map((client, index) => (
                      <div key={client.cardNumber}>
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Icon name="User" size={24} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <div className="grid gap-2 mt-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                                <span className="font-mono">{formatCardNumber(client.cardNumber)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Phone" size={16} className="text-muted-foreground" />
                                <span>{client.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Mail" size={16} className="text-muted-foreground" />
                                <span>{client.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                                <span>Клиент с {formatDate(client.registeredAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCallClient(client)}
                            >
                              <Icon name="Phone" className="mr-2" size={16} />
                              Позвонить
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => setManageClient(client)}
                            >
                              <Icon name="Settings" className="mr-2" size={16} />
                              Управление
                            </Button>
                          </div>
                        </div>
                        {index < clients.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Статистика операций</CardTitle>
                  <CardDescription>Последние 30 дней</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-green-600" />
                      <span className="font-medium">Успешные операции</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">1,234</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingDown" size={20} className="text-red-600" />
                      <span className="font-medium">Отклонённые операции</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">23</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="DollarSign" size={20} className="text-blue-600" />
                      <span className="font-medium">Общий оборот</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">12.5M ₽</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Активность клиентов</CardTitle>
                  <CardDescription>Сегодня</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Онлайн сейчас</span>
                    <span className="text-2xl font-bold text-green-600">47</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Новых клиентов</span>
                    <span className="text-2xl font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Заявок на продукты</span>
                    <span className="text-2xl font-bold">8</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Топ операций</CardTitle>
                  <CardDescription>По количеству за месяц</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Переводы по номеру карты</span>
                      <Badge>456</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Оплата ЖКХ</span>
                      <Badge>234</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Пополнение мобильного</span>
                      <Badge>189</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Переводы по СБП</span>
                      <Badge>167</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Блокировки и мошенничество</CardTitle>
                  <CardDescription>За последнюю неделю</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="AlertTriangle" size={20} className="text-orange-600" />
                      <span className="font-medium">Подозрительные операции</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">15</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Ban" size={20} className="text-red-600" />
                      <span className="font-medium">Заблокированные карты</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">7</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Отчёты и выгрузки</CardTitle>
                <CardDescription>Создание отчётов по операциям и клиентам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="FileText" size={32} />
                    <span>Отчёт по операциям</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="Users" size={32} />
                    <span>Отчёт по клиентам</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="CreditCard" size={32} />
                    <span>Отчёт по картам</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="AlertTriangle" size={32} />
                    <span>Отчёт по мошенничеству</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="TrendingUp" size={32} />
                    <span>Финансовый отчёт</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="Download" size={32} />
                    <span>Выгрузка всех данных</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={!!actionCard} onOpenChange={() => setActionCard(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'block' 
                ? (actionCard?.status === 'blocked' ? 'Разблокировать карту?' : 'Заблокировать карту?')
                : 'Перевыпустить карту?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'block' 
                ? (actionCard?.status === 'blocked' 
                    ? 'Клиент снова сможет пользоваться картой после разблокировки.'
                    : 'Все операции по карте будут временно приостановлены.')
                : 'Будет выпущена новая карта с новым номером. Текущая карта будет заблокирована.'}
              <br />
              <br />
              Карта: <span className="font-mono font-semibold">
                {actionCard && formatCardNumber(actionCard.number)}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {callClient && (
        <CallClientModal
          client={callClient}
          onClose={() => setCallClient(null)}
        />
      )}

      {manageClient && (
        <ClientManagementModal
          client={manageClient}
          onClose={() => setManageClient(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;