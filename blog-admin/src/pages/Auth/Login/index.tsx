import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/slices/authSlice';
import type { AppDispatch } from '../../../store';
import './index.css';

const { Title, Text } = Typography;

/**
 * 登录表单数据接口
 */
interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

/**
 * 登录页面组件
 */
const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  /**
   * 处理登录提交
   */
  const handleLogin = async (values: LoginFormData) => {
    try {
      setLoading(true);
      
      // 调用登录API
      const result = await dispatch(login({
        username: values.username,
        password: values.password,
        remember: values.remember || false
      })).unwrap();

      // 登录成功
      message.success('登录成功！');
      // 登录成功后跳转到首页
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('登录错误:', error);
      message.error(error || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理登录失败
   */
  const handleLoginFailed = (errorInfo: any) => {
    console.log('表单验证失败:', errorInfo);
    message.error('请检查输入信息');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-content">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <Title level={2} className="login-title">
              博客管理系统
            </Title>
            <Text type="secondary" className="login-subtitle">
              欢迎回来，请登录您的账户
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            onFinishFailed={handleLoginFailed}
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名!' },
                { min: 3, message: '用户名至少3个字符!' },
                { max: 20, message: '用户名不能超过20个字符!' },
                { 
                  pattern: /^[a-zA-Z0-9_]+$/, 
                  message: '用户名只能包含字母、数字和下划线!' 
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 6, message: '密码至少6个字符!' },
                { max: 50, message: '密码不能超过50个字符!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="请输入密码"
                autoComplete="current-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Link to="/auth/forgot-password" className="login-forgot">
                  忘记密码？
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
                block
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>

            <div className="login-footer">
              <Text type="secondary">
                还没有账户？
                <Link to="/auth/register" className="login-register-link">
                  立即注册
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;