import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ApiConfigPage() {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  // 检查当前配置
  const checkCurrentConfig = () => {
    const currentApiKey = import.meta.env.VITE_ERNIE_API_KEY;
    const currentSecretKey = import.meta.env.VITE_ERNIE_SECRET_KEY;
    
    if (currentApiKey && currentSecretKey && 
        currentApiKey !== 'your_api_key_here' && 
        currentSecretKey !== 'your_secret_key_here') {
      setIsConfigured(true);
      setApiKey(currentApiKey);
      setSecretKey(currentSecretKey);
    }
  };

  // 页面加载时检查配置
  useState(() => {
    checkCurrentConfig();
  });

  const handleCopyEnvContent = () => {
    const envContent = `
VITE_APP_ID=app-7m0ueu4u3lz5

# 百度文心一言 API 密钥
VITE_ERNIE_API_KEY=${apiKey || 'your_api_key_here'}
VITE_ERNIE_SECRET_KEY=${secretKey || 'your_secret_key_here'}
`.trim();

    navigator.clipboard.writeText(envContent);
    toast({
      title: '✅ 已复制',
      description: '配置内容已复制到剪贴板，请粘贴到 .env 文件中',
    });
  };

  const handleSaveConfig = () => {
    if (!apiKey || !secretKey) {
      toast({
        title: '❌ 配置不完整',
        description: '请填写完整的 API Key 和 Secret Key',
        variant: 'destructive',
      });
      return;
    }

    if (apiKey === 'your_api_key_here' || secretKey === 'your_secret_key_here') {
      toast({
        title: '❌ 无效的密钥',
        description: '请填写真实的 API 密钥，而不是示例值',
        variant: 'destructive',
      });
      return;
    }

    handleCopyEnvContent();
    
    toast({
      title: '⚠️ 需要手动操作',
      description: '配置内容已复制，请按照下方步骤完成配置',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            API 配置助手
          </h1>
          <p className="text-muted-foreground">
            配置百度文心一言 API 密钥以启用 AI 分析功能
          </p>
        </div>

        {/* 当前配置状态 */}
        {isConfigured ? (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              ✅ API 已配置
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              您的 API 密钥已配置完成，可以正常使用 AI 分析功能。
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
              ⚠️ 需要配置 API 密钥
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              AI 分析功能需要配置百度文心一言 API 密钥才能使用。
            </AlertDescription>
          </Alert>
        )}

        {/* 步骤 1：获取 API 密钥 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-bold">
                1
              </span>
              获取 API 密钥
            </CardTitle>
            <CardDescription>
              访问百度智能云千帆平台获取您的 API 密钥
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                1. 访问百度智能云千帆平台
              </p>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open('https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application', '_blank')}
              >
                <span>打开千帆平台应用控制台</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                2. 注册并登录账号（如果还没有账号）
              </p>
              <p className="text-sm text-muted-foreground">
                3. 创建应用，获取 <strong>API Key</strong> 和 <strong>Secret Key</strong>
              </p>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                💡 <strong>提示</strong>：首次使用会有免费额度，足够测试使用。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 步骤 2：填写 API 密钥 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-bold">
                2
              </span>
              填写 API 密钥
            </CardTitle>
            <CardDescription>
              将获取到的密钥填写到下方输入框中
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="请输入您的 API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecretKey ? 'text' : 'password'}
                  placeholder="请输入您的 Secret Key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSaveConfig}
              disabled={!apiKey || !secretKey}
            >
              <Copy className="w-4 h-4 mr-2" />
              复制配置内容
            </Button>
          </CardContent>
        </Card>

        {/* 步骤 3：配置到 .env 文件 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-bold">
                3
              </span>
              配置到 .env 文件
            </CardTitle>
            <CardDescription>
              将配置内容保存到项目根目录的 .env 文件中
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">📁 .env 文件位置：</p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                /workspace/app-7m0ueu4u3lz5/.env
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">📝 操作步骤：</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>点击上方"复制配置内容"按钮</li>
                <li>打开项目根目录下的 <code className="bg-muted px-1 rounded">.env</code> 文件</li>
                <li>将复制的内容粘贴到文件中（替换原有内容）</li>
                <li>保存文件</li>
                <li>重启应用（如果正在运行）</li>
              </ol>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                💡 <strong>提示</strong>：.env 文件是隐藏文件（以 . 开头），在某些文件管理器中需要显示隐藏文件才能看到。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 步骤 4：重启应用 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-bold">
                4
              </span>
              重启应用
            </CardTitle>
            <CardDescription>
              配置完成后需要重启应用才能生效
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                在终端中执行以下命令：
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm space-y-2">
                <div># 如果应用正在运行，先停止（Ctrl+C）</div>
                <div># 然后重新启动</div>
                <div className="text-blue-600 dark:text-blue-400">npm run dev -- --host 127.0.0.1</div>
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                配置完成后，您就可以使用 AI 分析功能了！
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 帮助链接 */}
        <Card>
          <CardHeader>
            <CardTitle>📚 需要帮助？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open('./docs/API配置说明.md', '_blank')}
            >
              <span>查看详细配置文档</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open('./docs/用户使用指南.md', '_blank')}
            >
              <span>查看用户使用指南</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
