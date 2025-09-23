import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../../api/auth';
import type { AppDispatch } from '../../../store';
import './index.css';

const { Title, Text } = Typography;

/**
 * 注册表单数据接口
 */
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

/**
 * 注册页面组件
 */
const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  /**
   * 处理注册提交
   */
  const handleRegister = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      
      // 调用注册API
      const response = await authAPI.register({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        message.success('注册成功！请登录您的账户');
        // 注册成功后跳转到登录页面
        navigate('/auth/login', { replace: true });
      } else {
        message.error(response.message || '注册失败，请稍后重试');
      }
    } catch (error: any) {
      console.error('注册错误:', error);
      message.error(error.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理注册失败
   */
  const handleRegisterFailed = (errorInfo: any) => {
    console.log('表单验证失败:', errorInfo);
    message.error('请检查输入信息');
  };

  /**
   * 验证密码一致性
   */
  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次输入的密码不一致!'));
  };

  /**
   * 验证用户名格式
   */
  const validateUsername = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入用户名!'));
    }
    if (value.length < 3) {
      return Promise.reject(new Error('用户名至少3个字符!'));
    }
    if (value.length > 20) {
      return Promise.reject(new Error('用户名不能超过20个字符!'));
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject(new Error('用户名只能包含字母、数字和下划线!'));
    }
    return Promise.resolve();
  };

  /**
   * 验证邮箱格式
   */
  const validateEmail = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入邮箱地址!'));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error('请输入有效的邮箱地址!'));
    }
    return Promise.resolve();
  };

  /**
   * 验证密码强度
   */
  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码!'));
    }
    if (value.length < 6) {
      return Promise.reject(new Error('密码至少6个字符!'));
    }
    if (value.length > 50) {
      return Promise.reject(new Error('密码不能超过50个字符!'));
    }
    // 检查密码强度：至少包含字母和数字
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
      return Promise.reject(new Error('密码必须包含字母和数字!'));
    }
    return Promise.resolve();
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-overlay"></div>
      </div>
      
      <div className="register-content">
        <Card className="register-card" bordered={false}>
          <div className="register-header">
            <Title level={2} className="register-title">
              创建账户
            </Title>
            <Text type="secondary" className="register-subtitle">
              加入我们，开始您的博客管理之旅
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            className="register-form"
            onFinish={handleRegister}
            onFinishFailed={handleRegisterFailed}
            size="large"
            autoComplete="off"
            scrollToFirstError
          >
            <Form.Item
              name="username"
              rules={[{ validator: validateUsername }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ validator: validateEmail }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="请输入邮箱地址"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ validator: validatePassword }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="请输入密码"
                autoComplete="new-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[{ validator: validateConfirmPassword }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="请确认密码"
                autoComplete="new-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议和隐私政策')),
                },
              ]}
            >
              <Checkbox>
                我已阅读并同意
                <Link to="/terms" target="_blank" className="register-link">
                  《用户协议》
                </Link>
                和
                <Link to="/privacy" target="_blank" className="register-link">
                  《隐私政策》
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-button"
                loading={loading}
                block
              >
                {loading ? '注册中...' : '立即注册'}
              </Button>
            </Form.Item>

            <div className="register-footer">
              <Text type="secondary">
                已有账户？
                <Link to="/auth/login" className="register-login-link">
                  立即登录
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;