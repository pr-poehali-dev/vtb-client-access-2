import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { type Card as CardType, type Transaction } from '@/pages/Index';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import SupportChat from '@/components/SupportChat';
import PaymentModal from '@/components/PaymentModal';
import ApplyProductModal from '@/components/ApplyProductModal';

type DashboardProps = {
  cards: CardType[];
  transactions: Transaction[];
  onLogout: () => void;
};

const Dashboard = ({ cards, transactions, onLogout }: DashboardProps) => {
  const [selectedCard, setSelectedCard] = useState(cards[0]?.id || '');
  const [showSupport, setShowSupport] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'phone' | 'requisites' | 'utilities' | 'mobile' | 'internet' | null>(null);
  const [productType, setProductType] = useState<'debit' | 'credit' | 'savings' | 'loan' | null>(null);

  const formatCardNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`;
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
    }).format(date);
  };

  const currentCard = cards.find(c => c.id === selectedCard) || cards[0];
  const cardTransactions = transactions.filter(t => t.cardId === selectedCard);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[hsl(var(--primary))] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐱</span>
            <div>
              <h1 className="text-2xl font-bold">Барсик Банк</h1>
              <p className="text-blue-100 text-sm">Добро пожаловать!</p>
            </div>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={onLogout}>
            <Icon name="LogOut" className="mr-2" size={20} />
            Выход
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-12">
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Icon name="CreditCard" size={18} />
              <span className="hidden sm:inline">Карты</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Icon name="Send" size={18} />
              <span className="hidden sm:inline">Переводы</span>
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <Icon name="FileText" size={18} />
              <span className="hidden sm:inline">Оформить</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Icon name="Headphones" size={18} />
              <span className="hidden sm:inline">Поддержка</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Card 
                  key={card.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCard === card.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant={card.type === 'debit' ? 'default' : 'secondary'}>
                        {card.type === 'debit' ? 'Дебетовая' : 'Кредитная'}
                      </Badge>
                      <Icon name="Wifi" size={24} className="text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Баланс</p>
                      <p className="text-3xl font-bold">
                        {formatAmount(card.balance)} ₽
                      </p>
                    </div>
                    <div>
                      <p className="text-lg tracking-wider font-mono">
                        {formatCardNumber(card.number)}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{card.holder}</span>
                        <span className="text-xs text-muted-foreground">{card.expiryDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>История операций</CardTitle>
                <CardDescription>
                  Карта {formatCardNumber(currentCard?.number || '')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {cardTransactions.map((transaction, index) => (
                      <div key={transaction.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <Icon 
                                name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                                size={20}
                                className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(transaction.date)}
                              </p>
                            </div>
                          </div>
                          <span className={`text-lg font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)} ₽
                          </span>
                        </div>
                        {index < cardTransactions.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Переводы и платежи</CardTitle>
                <CardDescription>Отправьте деньги или оплатите услуги</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setPaymentType('card')}>
                    <Icon name="User" size={24} />
                    По номеру карты
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setPaymentType('phone')}>
                    <Icon name="Smartphone" size={24} />
                    По номеру телефона
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setPaymentType('requisites')}>
                    <Icon name="Building" size={24} />
                    По реквизитам
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setPaymentType('utilities')}>
                    <Icon name="Zap" size={24} />
                    Коммунальные услуги
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setPaymentType('mobile')}>
                    <Icon name="Phone" size={24} />
                    Мобильная связь
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setPaymentType('internet')}>
                    <Icon name="Tv" size={24} />
                    Интернет и ТВ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle>Оформить продукт</CardTitle>
                <CardDescription>Выберите подходящий банковский продукт</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Дебетовая карта</CardTitle>
                      <CardDescription>Кешбэк до 30% на всё</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => setProductType('debit')}>
                        <Icon name="Plus" className="mr-2" size={18} />
                        Оформить
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Кредитная карта</CardTitle>
                      <CardDescription>До 200 дней без процентов</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => setProductType('credit')}>
                        <Icon name="Plus" className="mr-2" size={18} />
                        Оформить
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Накопительный счёт</CardTitle>
                      <CardDescription>До 18% годовых</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => setProductType('savings')}>
                        <Icon name="Plus" className="mr-2" size={18} />
                        Открыть
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Кредит наличными</CardTitle>
                      <CardDescription>Ставка от 5.9%</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => setProductType('loan')}>
                        <Icon name="Plus" className="mr-2" size={18} />
                        Оформить
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Техническая поддержка</CardTitle>
                <CardDescription>Мы всегда готовы помочь</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Icon name="Phone" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Телефон поддержки</h3>
                      <p className="text-2xl font-bold text-primary">8 800 100-24-24</p>
                      <p className="text-sm text-muted-foreground mt-1">Круглосуточно, бесплатно</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Icon name="MessageCircle" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Онлайн-чат</h3>
                      <Button className="mt-2" onClick={() => setShowSupport(true)}>Начать чат</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Часто задаваемые вопросы</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start h-auto py-3">
                      <Icon name="HelpCircle" className="mr-2 shrink-0" size={18} />
                      <span className="text-left">Как заблокировать карту?</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-auto py-3">
                      <Icon name="HelpCircle" className="mr-2 shrink-0" size={18} />
                      <span className="text-left">Как перевыпустить карту?</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-auto py-3">
                      <Icon name="HelpCircle" className="mr-2 shrink-0" size={18} />
                      <span className="text-left">Как изменить лимиты по карте?</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {showSupport && <SupportChat onClose={() => setShowSupport(false)} />}
      {paymentType && <PaymentModal type={paymentType} cards={cards} onClose={() => setPaymentType(null)} />}
      {productType && <ApplyProductModal type={productType} onClose={() => setProductType(null)} />}
    </div>
  );
};

export default Dashboard;