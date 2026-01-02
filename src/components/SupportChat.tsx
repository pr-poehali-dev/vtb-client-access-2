import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type SupportChatProps = {
  onClose: () => void;
};

const botResponses: Record<string, string> = {
  'блокировка': 'Для блокировки карты:\n1. Позвоните на горячую линию 8 800 МЯУ-БАРС (8 800 692-2277)\n2. Или воспользуйтесь разделом "Карты" в личном кабинете\n3. Выберите нужную карту и нажмите "Заблокировать"\n\nМогу ли я помочь чем-то ещё?',
  'перевыпуск': 'Перевыпуск карты занимает 5-7 рабочих дней. Вы можете заказать перевыпуск:\n1. В разделе "Карты" личного кабинета\n2. В любом отделении Барсик Банка\n3. Позвонив на 8 800 МЯУ-БАРС\n\nНовая карта будет доставлена по адресу регистрации.',
  'перевод': 'Вы можете сделать перевод:\n1. По номеру карты (16 цифр)\n2. По номеру телефона (если получатель зарегистрирован в СБП)\n3. По реквизитам счёта\n\nПерейдите в раздел "Переводы" для выполнения операции. Комиссия 0% внутри Барсик Банка.',
  'баланс': 'Ваш текущий баланс отображается на главной странице в разделе "Карты". Также вы можете:\n1. Посмотреть баланс всех карт\n2. Увидеть историю операций\n3. Скачать выписку\n\nДля этого перейдите в раздел "Карты".',
  'лимит': 'Изменить лимиты можно:\n1. В настройках карты в личном кабинете\n2. Позвонив на 8 800 МЯУ-БАРС\n3. В мобильном приложении Барсик Банка\n\nДоступны лимиты на:\n- Снятие наличных\n- Покупки в интернете\n- Операции за границей',
  'кредит': 'У Барсик Банка есть несколько кредитных продуктов:\n1. Кредитная карта - до 200 дней без %\n2. Потребительский кредит - от 5.9%\n3. Автокредит - от 0.01%\n4. Ипотека - от 5%\n\nДля оформления перейдите в раздел "Оформить продукт".',
  'default': 'Я бот технической поддержки Барсик Банка! 🐱 Могу помочь с:\n\n• Блокировкой и перевыпуском карт\n• Переводами и платежами\n• Проверкой баланса\n• Изменением лимитов\n• Оформлением продуктов\n\nЗадайте ваш вопрос или позвоните на горячую линию 8 800 МЯУ-БАРС (круглосуточно)'
};

const quickQuestions = [
  'Как заблокировать карту?',
  'Как сделать перевод?',
  'Как изменить лимит?',
  'Как оформить кредит?'
];

const SupportChat = ({ onClose }: SupportChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Здравствуйте! Я виртуальный помощник Барсик Банка 🐱 Чем могу помочь?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return botResponses.default;
  };

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Headphones" size={20} className="text-white" />
            </div>
            <div>
              <CardTitle>Техническая поддержка</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Онлайн</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="px-4 py-3 border-t bg-gray-50">
              <p className="text-xs text-muted-foreground mb-2">Быстрые вопросы:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <Badge
                    key={question}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите ваш вопрос..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Icon name="Send" size={20} />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Или позвоните: <span className="font-semibold">8 800 МЯУ-БАРС (692-2277)</span> (круглосуточно)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportChat;