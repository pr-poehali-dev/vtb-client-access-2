import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type LoginPageProps = {
  onLogin: (cardNumber: string, success: boolean) => void;
};

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cardNumber.length !== 16) {
      toast.error('Неверный формат номера карты', {
        description: 'Номер карты должен содержать 16 цифр'
      });
      onLogin(cardNumber, false);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast.success('Вход выполнен успешно');
      onLogin(cardNumber, true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))] to-blue-700 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-lg">
            <Icon name="Landmark" size={40} className="text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ВТБ Онлайн</h1>
          <p className="text-blue-100">Интернет-банк для физических лиц</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
            <CardDescription className="text-center">
              Введите номер карты для входа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cardNumber" className="text-sm font-medium">
                  Номер карты
                </label>
                <div className="relative">
                  <Icon 
                    name="CreditCard" 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                    size={20} 
                  />
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234567890123456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={16}
                    className="pl-10 text-lg tracking-wider"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  16 цифр без пробелов
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading || cardNumber.length !== 16}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                    Проверка...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" className="mr-2" size={20} />
                    Войти
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between text-sm">
                <Button variant="ghost" size="sm" className="text-primary">
                  <Icon name="HelpCircle" className="mr-1" size={16} />
                  Помощь
                </Button>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Icon name="UserPlus" className="mr-1" size={16} />
                  Оформить карту
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-white text-sm">
          <p className="flex items-center justify-center gap-2">
            <Icon name="Shield" size={16} />
            Защищённое соединение
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
