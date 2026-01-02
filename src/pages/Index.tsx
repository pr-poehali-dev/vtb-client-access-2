import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';

export type LoginAttempt = {
  id: string;
  cardNumber: string;
  timestamp: Date;
  success: boolean;
  ipAddress: string;
  suspicious: boolean;
};

export type Card = {
  id: string;
  number: string;
  holder: string;
  expiryDate: string;
  balance: number;
  currency: string;
  type: 'debit' | 'credit';
  status: 'active' | 'blocked' | 'reissuing';
};

export type Transaction = {
  id: string;
  cardId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
};

export type Client = {
  cardNumber: string;
  name: string;
  phone: string;
  email: string;
  registeredAt: Date;
};

const ADMIN_CARD = '6637373727272917';

const mockCards: Card[] = [
  {
    id: '1',
    number: '1234567890123456',
    holder: 'IVAN PETROV',
    expiryDate: '12/27',
    balance: 125430.50,
    currency: 'RUB',
    type: 'debit',
    status: 'active',
  },
  {
    id: '2',
    number: '9876543210987654',
    holder: 'IVAN PETROV',
    expiryDate: '08/26',
    balance: 50000.00,
    currency: 'RUB',
    type: 'credit',
    status: 'active',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    cardId: '1',
    date: new Date('2026-01-01T14:30:00'),
    description: 'Покупка в Пятёрочка',
    amount: -1250.50,
    type: 'expense',
  },
  {
    id: '2',
    cardId: '1',
    date: new Date('2025-12-30T10:15:00'),
    description: 'Перевод от Сидорова А.',
    amount: 5000.00,
    type: 'income',
  },
  {
    id: '3',
    cardId: '1',
    date: new Date('2025-12-28T18:45:00'),
    description: 'Оплата ЖКХ',
    amount: -3500.00,
    type: 'expense',
  },
];

const mockClients: Client[] = [
  {
    cardNumber: '1234567890123456',
    name: 'Иван Петров',
    phone: '+7 999 123-45-67',
    email: 'ivan.petrov@example.com',
    registeredAt: new Date('2023-05-15'),
  },
  {
    cardNumber: '9876543210987654',
    name: 'Мария Сидорова',
    phone: '+7 999 765-43-21',
    email: 'maria.sidorova@example.com',
    registeredAt: new Date('2024-02-20'),
  },
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [clients] = useState<Client[]>(mockClients);

  const handleLogin = (cardNumber: string, success: boolean) => {
    const attempt: LoginAttempt = {
      id: Date.now().toString(),
      cardNumber,
      timestamp: new Date(),
      success,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
      suspicious: cardNumber.length !== 16 || !success,
    };

    setLoginAttempts(prev => [attempt, ...prev]);

    if (success) {
      if (cardNumber === ADMIN_CARD) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setCurrentUser(cardNumber);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser('');
  };

  const handleBlockCard = (cardId: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, status: card.status === 'blocked' ? 'active' : 'blocked' }
          : card
      )
    );
  };

  const handleReissueCard = (cardId: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, status: 'reissuing' } : card
      )
    );

    setTimeout(() => {
      setCards(prev =>
        prev.map(card =>
          card.id === cardId ? { ...card, status: 'active' } : card
        )
      );
    }, 3000);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (isAdmin) {
    return (
      <AdminDashboard
        loginAttempts={loginAttempts}
        cards={cards}
        clients={clients}
        onLogout={handleLogout}
        onBlockCard={handleBlockCard}
        onReissueCard={handleReissueCard}
      />
    );
  }

  return (
    <Dashboard
      cards={cards.filter(c => c.status !== 'blocked')}
      transactions={transactions}
      onLogout={handleLogout}
    />
  );
};

export default Index;