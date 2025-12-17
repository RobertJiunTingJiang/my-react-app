import React, { useState, useEffect, useMemo } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Facebook, 
  MessageCircle, 
  Chrome, 
  Home,
  PlusSquare,
  BarChart2,
  Settings,
  Plus,
  ArrowLeft,
  Trash2,
  Edit2,
  Upload,
  ChevronRight,
  LogOut,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

import { Button, Input, Select, Card, Header, BottomNav } from './components/Layout';
import { 
  MetalType, 
  MetalTypeLabels, 
  TransactionType, 
  TransactionTypeLabels, 
  Currency, 
  WeightUnit, 
  Transaction, 
  User as UserType, 
  Tab 
} from './types';

// --- Mock Data ---
const MOCK_TRANSACTIONS: Transaction[] = [
  { 
    id: '1', 
    userId: 'u1',
    type: TransactionType.Buy,
    date: '2025-06-01', 
    metalType: MetalType.Gold, 
    weight: 2.0, 
    weightUnit: WeightUnit.Qian,
    pricePerUnit: 12000, 
    laborCost: 0,
    totalAmount: 24000,
    currency: Currency.TWD, 
    exchangeRate: 1,
    channel: 'XX銀樓',
    createdAt: '2025-06-01T10:00:00Z'
  },
  { 
    id: '2', 
    userId: 'u1',
    type: TransactionType.Buy,
    date: '2025-05-03', 
    metalType: MetalType.KGold, 
    weight: 2.0, 
    weightUnit: WeightUnit.Qian,
    pricePerUnit: 12000, 
    laborCost: 0,
    totalAmount: 24000,
    currency: Currency.TWD, 
    exchangeRate: 1,
    channel: 'XX銀行',
    createdAt: '2025-05-03T10:00:00Z'
  },
  { 
    id: '3', 
    userId: 'u1',
    type: TransactionType.Buy,
    date: '2024-11-08', 
    metalType: MetalType.Platinum, 
    weight: 2.0, 
    weightUnit: WeightUnit.Qian,
    pricePerUnit: 12000, 
    laborCost: 0,
    totalAmount: 24000,
    currency: Currency.TWD, 
    exchangeRate: 1,
    channel: 'XX銀樓',
    createdAt: '2024-11-08T10:00:00Z'
  },
];

const MOCK_USER: UserType = {
  id: 'u1',
  name: "UserName",
  email: "user@example.com",
  defaultCurrency: Currency.TWD,
  createdAt: '2024-01-01T00:00:00Z'
};

// --- Sub-Screen Components ---

const LoginScreen: React.FC<{ onLogin: () => void; onGoRegister: () => void }> = ({ onLogin, onGoRegister }) => (
  <div className="min-h-screen bg-gentle-bg flex flex-col p-6 items-center justify-center">
    <div className="w-full max-w-sm flex flex-col gap-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gentle-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">🐚</span>
        </div>
        <h1 className="text-xl font-bold text-gentle-primary-dark">繭夕・黃金記帳本</h1>
      </div>

      <div className="space-y-4">
        <Input label="帳號" placeholder="Enter your email or account" />
        <Input label="密碼" type="password" placeholder="Enter your password" />
      </div>

      <Button onClick={onLogin} fullWidth className="mt-4 text-lg">登入</Button>

      <div className="flex flex-col gap-3 mt-4">
        <Button variant="google" fullWidth icon={<Chrome size={18}/>}>google登入</Button>
        <Button variant="line" fullWidth icon={<MessageCircle size={18}/>}>使用line登入</Button>
        <Button variant="facebook" fullWidth icon={<Facebook size={18}/>}>使用FB登入</Button>
      </div>
      
      <div className="text-center mt-4">
        <button onClick={onGoRegister} className="text-gentle-text-light underline">
          註冊新帳號
        </button>
      </div>
    </div>
  </div>
);

const RegisterScreen: React.FC<{ onRegister: () => void; onBack: () => void }> = ({ onRegister, onBack }) => (
  <div className="min-h-screen bg-gentle-bg flex flex-col p-6 items-center justify-center relative">
    <div className="absolute top-0 left-0 w-full p-4 bg-gentle-primary/30 text-center font-bold text-white text-lg">
      註冊帳號
    </div>
    
    <div className="w-full max-w-sm flex flex-col gap-5 mt-12">
       <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gentle-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">
          <span className="text-3xl">🐚</span>
        </div>
        <h2 className="text-lg font-bold text-gentle-primary-dark">繭夕・黃金記帳本</h2>
      </div>

      <Input label="姓名" placeholder="Enter your full name" />
      <Input label="電子郵件" placeholder="Enter your email" />
      <Input label="密碼" type="password" placeholder="Enter your password" />
      <Input label="確認密碼" type="password" placeholder="Re-enter your password" />

      <Button onClick={onRegister} fullWidth className="mt-6">註冊</Button>
      <Button variant="ghost" onClick={onBack} fullWidth>返回登入</Button>
    </div>

     <div className="mt-12 text-center opacity-50">
        <span className="text-4xl text-gentle-primary">繭夕</span>
        <p className="text-xs text-gentle-primary-dark mt-1">gentle and genuine</p>
    </div>
  </div>
);

// --- Main App Components ---

const HomeScreen: React.FC<{ user: UserType; transactions: Transaction[]; onChangeTab: (t: Tab) => void }> = ({ user, transactions, onChangeTab }) => {
  // Only calculate cost for BUY transactions for now
  const buyTransactions = transactions.filter(t => t.type === TransactionType.Buy);
  const totalCost = buyTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
  
  // Mock calculation
  const estimatedReturn = Math.round(totalCost * 1.15); 
  const profit = estimatedReturn - totalCost;

  return (
    <div className="pb-24">
      <Header title={`歡迎使用 [${user.name}]`} rightIcon={<Plus size={24}/>} onRightClick={() => onChangeTab('add')} />
      
      <div className="px-4 mt-4">
        <h2 className="font-bold text-gentle-text mb-3">全部資產</h2>
        <div className="grid grid-cols-3 gap-3">
          <Card className="flex flex-col items-center justify-center py-4 bg-gentle-input/50">
            <span className="text-xs text-gentle-text-light mb-1">持有總成本</span>
            <span className="text-lg font-bold text-gentle-text">{totalCost.toLocaleString()}</span>
          </Card>
          <Card className="flex flex-col items-center justify-center py-4 bg-gentle-input/50">
            <span className="text-xs text-gentle-text-light mb-1">預估收益</span>
            <span className="text-lg font-bold text-red-500">{profit.toLocaleString()}</span>
          </Card>
          <Card className="flex flex-col items-center justify-center py-4 bg-gentle-input/50">
            <span className="text-xs text-gentle-text-light mb-1">交易筆數</span>
            <span className="text-lg font-bold text-gentle-text">{transactions.length}</span> 
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="font-bold text-gentle-text mb-3 tracking-widest">最近紀錄</h2>
          <div className="flex flex-col gap-3">
            {transactions.slice(0, 3).map(record => (
              <div key={record.id} className="flex items-center justify-between border-b border-gentle-primary/20 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.type === TransactionType.Buy ? 'bg-gentle-primary/20 text-gentle-primary' : 'bg-green-100 text-green-600'}`}>
                    {record.type === TransactionType.Buy ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-gentle-text">{record.date.replace(/-/g, '/')}</div>
                    <div className="text-xs text-gentle-text-light">{MetalTypeLabels[record.metalType]} - {record.weight}{record.weightUnit}</div>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-bold text-gentle-text">{record.currency} {record.totalAmount.toLocaleString()}</div>
                   <div className="text-xs text-gentle-text-light">{TransactionTypeLabels[record.type]}</div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="secondary" fullWidth className="mt-4 bg-white" onClick={() => onChangeTab('records')}>
            查看所有紀錄
          </Button>

          <Button fullWidth className="mt-4" onClick={() => onChangeTab('add')}>
             新增交易
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddRecordScreen: React.FC<{ onSave: (r: Partial<Transaction>) => void; onBack: () => void }> = ({ onSave, onBack }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: TransactionType.Buy,
    currency: Currency.TWD,
    metalType: MetalType.Gold,
    weightUnit: WeightUnit.Qian,
    date: new Date().toISOString().split('T')[0],
    laborCost: 0,
    pricePerUnit: 0,
    weight: 0
  });

  const handleChange = (field: keyof Transaction, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto calculate total
      if (['pricePerUnit', 'weight', 'laborCost'].includes(field)) {
        const p = Number(updated.pricePerUnit) || 0;
        const w = Number(updated.weight) || 0;
        const l = Number(updated.laborCost) || 0;
        updated.totalAmount = (p * w) + l;
      }
      return updated;
    });
  };

  return (
    <div className="pb-24">
      <Header title="新增交易" leftIcon={<ArrowLeft size={24} />} onLeftClick={onBack} />
      
      <div className="px-6 py-4 flex flex-col gap-4">
        
        {/* Type Selector (Buy/Sell) */}
        <div className="grid grid-cols-2 gap-3 mb-2">
            {Object.values(TransactionType).map(t => (
               <button 
                key={t}
                onClick={() => handleChange('type', t)}
                className={`py-2 rounded-lg font-bold border ${formData.type === t ? (t === TransactionType.Buy ? 'bg-gentle-primary text-white border-gentle-primary' : 'bg-green-500 text-white border-green-500') : 'bg-transparent border-gray-300 text-gray-400'}`}
               >
                 {TransactionTypeLabels[t]}
               </button>
            ))}
        </div>

        {/* Metal Type Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {Object.values(MetalType).map((type) => (
            <button
              key={type}
              onClick={() => handleChange('metalType', type)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all whitespace-nowrap ${formData.metalType === type ? 'bg-gentle-primary text-white' : 'bg-gentle-input text-gentle-text'}`}
            >
              {MetalTypeLabels[type]}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
           <Input 
             className="flex-1"
             label="重量" 
             placeholder="0.00" 
             type="number"
             value={formData.weight || ''}
             onChange={(e) => handleChange('weight', Number(e.target.value))}
           />
           <div className="w-1/3">
             <Select 
               label="單位" 
               options={Object.values(WeightUnit).map(u => ({ label: u, value: u }))}
               value={formData.weightUnit}
               onChange={(e) => handleChange('weightUnit', e.target.value)}
             />
           </div>
        </div>

        <Input 
          label="單價" 
          placeholder="每單位價格" 
          type="number"
          value={formData.pricePerUnit || ''}
          onChange={(e) => handleChange('pricePerUnit', Number(e.target.value))}
        />

        <Input 
          label="工錢 / 手續費" 
          placeholder="0" 
          type="number"
          value={formData.laborCost || ''}
          onChange={(e) => handleChange('laborCost', Number(e.target.value))}
        />
        
        <div className="p-3 bg-gentle-input/50 rounded-lg flex justify-between items-center">
           <span className="font-bold text-gentle-text">總金額 (自動計算)</span>
           <span className="font-bold text-xl text-gentle-text">{formData.totalAmount?.toLocaleString()}</span>
        </div>

        {/* Currency & Channel */}
        <div className="flex gap-3">
           <div className="w-1/3">
             <Select 
                label="幣別"
                options={Object.values(Currency).map(c => ({ label: c, value: c }))}
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
             />
           </div>
           <Input 
             className="flex-1"
             label="購買渠道" 
             placeholder="例如：XX銀樓" 
             value={formData.channel || ''}
             onChange={(e) => handleChange('channel', e.target.value)}
           />
        </div>

        <Input 
          label="交易日期" 
          type="date"
          value={formData.date || ''}
          onChange={(e) => handleChange('date', e.target.value)}
        />

        <Input 
          label="備註" 
          placeholder="選填" 
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
        />

        {/* Photo Upload Placeholder */}
        <div className="h-24 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gentle-text-light cursor-pointer hover:bg-gray-100 transition-colors">
          <Upload size={20} className="mb-1" />
          <span className="font-bold text-xs">上傳購買憑證 (Photo URL)</span>
        </div>

        <Button onClick={() => onSave(formData)} className="mt-2">儲存紀錄</Button>
      </div>
    </div>
  );
};

const RecordsScreen: React.FC<{ transactions: Transaction[]; onDelete: (id: string) => void }> = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState<MetalType | 'ALL'>('ALL');

  const filtered = transactions.filter(r => filter === 'ALL' || r.metalType === filter);

  return (
    <div className="pb-24">
      <Header title="我的貴金屬帳本" />
      
      {/* Filter Tabs */}
      <div className="px-4 mt-2">
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
           <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 text-sm rounded-lg border transition-all whitespace-nowrap ${filter === 'ALL' ? 'bg-gentle-primary text-white border-gentle-primary' : 'bg-transparent border-gray-300 text-gentle-text'}`}
           >
             全部
           </button>
           {Object.values(MetalType).map((type) => (
             <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all whitespace-nowrap ${filter === type ? 'bg-gentle-primary text-white border-gentle-primary' : 'bg-transparent border-gray-300 text-gentle-text'}`}
             >
               {MetalTypeLabels[type]}
             </button>
           ))}
        </div>

        <h3 className="text-lg text-gentle-text-light font-medium mb-4">交易明細</h3>
        
        <div className="flex flex-col gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="relative flex flex-col gap-2 bg-white/60 p-4 rounded-xl border border-gentle-primary/10 shadow-sm">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.type === TransactionType.Buy ? 'bg-[#E6CDB2] text-white' : 'bg-green-100 text-green-600'}`}>
                        {t.type === TransactionType.Buy ? <DollarSign size={20} /> : <TrendingDown size={20} />}
                     </div>
                     <div>
                        <div className="font-bold text-gentle-text text-lg">{MetalTypeLabels[t.metalType]}</div>
                        <div className="text-xs text-gentle-text-light">{t.date}</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className={`font-bold text-lg ${t.type === TransactionType.Buy ? 'text-gentle-text' : 'text-green-600'}`}>
                        {t.type === TransactionType.Buy ? '-' : '+'}{t.totalAmount.toLocaleString()}
                     </div>
                     <div className="text-xs text-gentle-text-light">{t.currency}</div>
                  </div>
               </div>

               <div className="flex justify-between items-center pl-14 pr-1 mt-1 text-sm text-gentle-text">
                  <div className="flex gap-4">
                     <div><span className="text-gentle-text-light text-xs">重量:</span> {t.weight}{t.weightUnit}</div>
                     <div><span className="text-gentle-text-light text-xs">單價:</span> {t.pricePerUnit}</div>
                  </div>
                  <div>
                    {t.laborCost > 0 && <span className="text-xs text-gentle-text-light bg-orange-100 px-2 py-1 rounded">含工錢 {t.laborCost}</span>}
                  </div>
               </div>

               <div className="absolute top-4 right-2 flex flex-col gap-2 opacity-0 hover:opacity-100 transition-opacity">
                   <button onClick={() => onDelete(t.id)} className="p-2 bg-white rounded-full shadow text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChartsScreen: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  // Simple aggregation for charts based on Transaction logic
  // Aggregate weight by metal type
  const dataByType = Object.values(MetalType).map(type => {
     const weight = transactions
       .filter(t => t.metalType === type && t.type === TransactionType.Buy)
       .reduce((acc, curr) => acc + curr.weight, 0); // Need unit conversion logic in real app, assume 'qian' for all
     return {
       name: MetalTypeLabels[type],
       value: weight
     };
  }).filter(d => d.value > 0);

  const trendData = [
    { name: '1', uv: 4000 },
    { name: '2', uv: 3000 },
    { name: '3', uv: 2000 },
    { name: '4', uv: 2780 },
    { name: '5', uv: 1890 },
    { name: '6', uv: 2390 },
    { name: '7', uv: 3490 },
  ];

  return (
    <div className="pb-24">
      <Header title="資產分析" />
      
      <div className="px-4 mt-2">
        <div className="grid grid-cols-3 gap-2 mb-6">
            <button className="py-2 text-sm rounded-lg bg-gentle-input font-bold text-gentle-text">黃金</button>
            <button className="py-2 text-sm rounded-lg bg-gentle-input text-gentle-text-light">K金</button>
            <button className="py-2 text-sm rounded-lg bg-gentle-input text-gentle-text-light">鉑金</button>
        </div>

        <Card className="mb-6 h-72">
          <h3 className="font-bold text-gentle-text mb-1">資產配置 (重量)</h3>
          <p className="text-xs text-gentle-text-light mb-4">單位: 台錢</p>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={dataByType}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9C8E7E', fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill="#DDB892" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-72">
          <h3 className="font-bold text-gentle-text mb-1">資產價值趨勢</h3>
          <p className="text-xs text-gentle-text-light mb-4">預估市值 (TWD)</p>
          <ResponsiveContainer width="100%" height="80%">
             <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DDB892" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#DDB892" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Area type="monotone" dataKey="uv" stroke="#DDB892" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
             </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

const SettingsScreen: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <div className="pb-24">
    <Header title="設定" leftIcon={<ArrowLeft size={24} />} />
    
    <div className="px-6 mt-6 flex flex-col gap-6">
      
      <button className="flex items-center gap-4 py-4 border-b border-gentle-primary/20 hover:bg-black/5 transition-colors -mx-2 px-2 rounded-lg">
        <div className="text-gentle-primary"><UserIcon size={24} /></div>
        <span className="text-gentle-text font-medium flex-1 text-left">編輯個人資料</span>
      </button>

      <button className="flex items-center gap-4 py-4 border-b border-gentle-primary/20 hover:bg-black/5 transition-colors -mx-2 px-2 rounded-lg">
        <div className="text-gentle-primary"><Upload size={24} /></div>
        <span className="text-gentle-text font-medium flex-1 text-left">匯出資料 (CSV/PDF)</span>
      </button>

      <button onClick={onLogout} className="flex items-center gap-4 py-4 border-b border-gentle-primary/20 hover:bg-black/5 transition-colors -mx-2 px-2 rounded-lg group">
        <div className="text-gentle-primary group-hover:text-red-500 transition-colors"><LogOut size={24} /></div>
        <span className="text-gentle-text font-medium flex-1 text-left group-hover:text-red-500 transition-colors">登出</span>
      </button>

    </div>
  </div>
);

// --- Main App Controller ---

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Simple Auth Flow
  const handleLogin = () => setUser(MOCK_USER);
  const handleRegister = () => {
    setUser(MOCK_USER);
    setIsRegistering(false);
  };
  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  // Data Actions
  const handleAddTransaction = (data: Partial<Transaction>) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      userId: user?.id || 'unknown',
      type: data.type || TransactionType.Buy,
      metalType: data.metalType || MetalType.Gold,
      date: data.date || new Date().toISOString().split('T')[0],
      weight: data.weight || 0,
      weightUnit: data.weightUnit || WeightUnit.Qian,
      pricePerUnit: data.pricePerUnit || 0,
      currency: data.currency || Currency.TWD,
      laborCost: data.laborCost || 0,
      totalAmount: data.totalAmount || 0,
      exchangeRate: 1, // Mock
      channel: data.channel || '自訂',
      notes: data.notes || '',
      imageUrl: data.imageUrl || '',
      createdAt: new Date().toISOString()
    };
    setTransactions([newTx, ...transactions]);
    setActiveTab('records'); 
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(r => r.id !== id));
  };

  // Navigation Config
  const tabs = [
    { id: 'records', label: '紀錄', icon: FileText },
    { id: 'add', label: '新增', icon: Plus },
    { id: 'charts', label: '圖表', icon: BarChart2 },
    { id: 'settings', label: '設定', icon: Settings },
  ];

  // Render Logic
  if (!user) {
    if (isRegistering) {
      return <RegisterScreen onRegister={handleRegister} onBack={() => setIsRegistering(false)} />;
    }
    return <LoginScreen onLogin={handleLogin} onGoRegister={() => setIsRegistering(true)} />;
  }

  return (
    <div className="min-h-screen bg-gentle-bg font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {activeTab === 'home' && <HomeScreen user={user} transactions={transactions} onChangeTab={setActiveTab} />}
      {activeTab === 'add' && <AddRecordScreen onSave={handleAddTransaction} onBack={() => setActiveTab('home')} />}
      {activeTab === 'records' && <RecordsScreen transactions={transactions} onDelete={handleDeleteTransaction} />}
      {activeTab === 'charts' && <ChartsScreen transactions={transactions} />}
      {activeTab === 'settings' && <SettingsScreen onLogout={handleLogout} />}

      {activeTab !== 'add' && (
         <BottomNav 
           activeTab={activeTab === 'home' ? 'records' : activeTab} 
           onTabChange={(id) => setActiveTab(id as Tab)} 
           tabs={tabs}
         />
      )}
    </div>
  );
}