import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { type Client } from '@/pages/Index';

type CallClientModalProps = {
  client: Client;
  onClose: () => void;
};

type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';

const CallClientModal = ({ client, onClose }: CallClientModalProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [notes, setNotes] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = () => {
    setCallStatus('calling');
    toast.info('Соединение с клиентом...');

    setTimeout(() => {
      setCallStatus('connected');
      toast.success('Клиент на линии');
    }, 2000 + Math.random() * 2000);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    toast.success('Звонок завершён', {
      description: `Длительность: ${formatDuration(callDuration)}`
    });
  };

  const handleSaveAndClose = () => {
    if (notes.trim()) {
      toast.success('Заметки сохранены');
    }
    onClose();
  };

  const statusConfig = {
    idle: { color: 'bg-gray-100', textColor: 'text-gray-700', icon: 'Phone' as const, text: 'Готов к звонку' },
    calling: { color: 'bg-yellow-100', textColor: 'text-yellow-700', icon: 'PhoneOutgoing' as const, text: 'Соединение...' },
    connected: { color: 'bg-green-100', textColor: 'text-green-700', icon: 'PhoneCall' as const, text: 'На связи' },
    ended: { color: 'bg-red-100', textColor: 'text-red-700', icon: 'PhoneOff' as const, text: 'Звонок завершён' }
  };

  const status = statusConfig[callStatus];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={24} className="text-primary" />
              <CardTitle>Звонок клиенту</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              disabled={callStatus === 'calling' || callStatus === 'connected'}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{client.name}</h3>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
                <p className="text-xs text-muted-foreground mt-1">{client.email}</p>
              </div>
            </div>

            <div className={`${status.color} ${status.textColor} p-4 rounded-lg flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <Icon name={status.icon} size={24} />
                <div>
                  <p className="font-semibold">{status.text}</p>
                  {callStatus === 'connected' && (
                    <p className="text-sm font-mono mt-1">{formatDuration(callDuration)}</p>
                  )}
                </div>
              </div>
              
              {callStatus === 'calling' && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {(callStatus === 'connected' || callStatus === 'ended') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Заметки о звонке</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Опишите результат разговора с клиентом..."
                  rows={4}
                  disabled={callStatus === 'calling'}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            {callStatus === 'idle' && (
              <Button className="w-full h-12" onClick={handleCall}>
                <Icon name="Phone" className="mr-2" size={20} />
                Позвонить
              </Button>
            )}

            {callStatus === 'calling' && (
              <Button className="w-full h-12" variant="outline" disabled>
                <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                Соединение...
              </Button>
            )}

            {callStatus === 'connected' && (
              <Button className="w-full h-12" variant="destructive" onClick={handleEndCall}>
                <Icon name="PhoneOff" className="mr-2" size={20} />
                Завершить звонок
              </Button>
            )}

            {callStatus === 'ended' && (
              <>
                <Button className="w-full" onClick={handleSaveAndClose}>
                  <Icon name="Save" className="mr-2" size={18} />
                  Сохранить заметки
                </Button>
                <Button className="w-full" variant="outline" onClick={onClose}>
                  Закрыть без сохранения
                </Button>
              </>
            )}

            {callStatus !== 'calling' && callStatus !== 'connected' && callStatus !== 'ended' && (
              <Button className="w-full" variant="outline" onClick={onClose}>
                Отмена
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Icon name="Info" size={12} />
              Все звонки записываются для контроля качества
            </p>
            <p>Номер карты: {client.cardNumber.slice(0, 4)} **** **** {client.cardNumber.slice(-4)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallClientModal;
