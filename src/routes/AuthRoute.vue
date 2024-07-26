<script setup>
import {onMounted, ref} from 'vue';
import {User, KeySquare} from 'lucide-vue-next';
import Loader from '@/shared/Loader.vue';
import {notification} from '@/lib/toastService';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/store/user';

const regex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-]).+$/;

const username = ref('');
const password = ref('');

const loader = ref(true);
const error = ref(false);

const router = useRouter();
const userStore = useUserStore();

const shake = message => {
  notification(message, 'warning', 2000);

  const timeout = setTimeout(() => {
    error.value = false;
  }, 500);

  return () => clearTimeout(timeout);
};

const reset = () => {
  username.value = '';
  password.value = '';

  error.value = false;
};

const logIn = async () => {
  console.log('logIn');

  if (username.value === '' || password.value === '') {
    error.value = true;
    shake('Some fields are empty');

    reset();
    return;
  }

  if (!/^[a-zA-Z0-9]*$/.test(username.value)) {
    error.value = true;
    shake('Username must contain only English letters and digits');
    reset();
    return;
  }

  if (!regex.test(password.value)) {
    error.value = true;
    shake(
      'Password must be at least 8 characters long and contain only English letters and digits',
    );
    reset();
    return;
  }

  const res = await userStore.login(username.value, password.value);

  if (res === '400') {
    notification('Wrong username or password', 'warning', 2000);

    reset();
    return;
  } else if (!res) {
    notification('Failed to register', 'warning', 2000);
    router.push('/vue-todo.v2/404');
  } else {
    console.log('Login successful');
    await router.push('/vue-todo.v2/');
  }
};

onMounted(() => {
  const timeout = setTimeout(() => {
    loader.value = false;
    console.log('Component mounted');
  }, 500);

  return () => clearTimeout(timeout);
});
</script>

<template>
  <div>
    <Loader :isLoading="loader" :size="30" :needSub="false" />

    <Transition name="bounce">
      <form v-show="!loader" class="auth" @submit.prevent="logIn">
        <h2>
          Welcome back to <br />
          #TaskList
        </h2>

        <div class="item">
          <User :size="20" />
          <input v-model="username" type="text" placeholder="Username" />
        </div>

        <div class="item">
          <KeySquare size="20" />
          <input v-model="password" type="password" placeholder="Password" />

          <a class="forgot" href="/vue-todo.v2/register">Forgot password?</a>
        </div>

        <button type="submit" :class="{shake: error}">Sign in</button>

        <div class="register">
          Don't have an account? <a href="/vue-todo.v2/register">Sign up</a>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.auth {
  width: 20%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;

  margin: 0 auto;
  gap: 10px;

  h2 {
    font-size: 30px;
  }

  .item {
    width: 100%;

    display: flex;
    align-items: center;

    padding: 10px;
    gap: 5px;

    background: transparent;

    border-bottom: 1px solid var(--color-border);

    transition: 0.3s ease-in-out;

    input {
      width: 90%;

      background-color: transparent;
      border: none;
      outline: none;

      color: var(--color-text);
    }

    .forgot {
      font-size: 12px;
      color: var(--color-text);

      transition: 0.3s ease-in-out;

      &:hover {
        scale: 1.1;
        color: var(--color-warning);
        animation: rotate 0.5s;
      }
    }

    &:hover {
      scale: 1.02;
    }
  }

  button {
    cursor: pointer;

    margin-top: 10px;
    padding: 10px 0;

    font-weight: 500;

    background-color: transparent;
    color: var(--color-text);
    outline: none;
    border: 1px solid var(--color-border);
    border-radius: 8px;

    transition: 0.3s ease-in-out;

    &:hover {
      scale: 1.05;
      background-color: var(--color-text);
      color: var(--color-background-mute);
    }
  }

  .register {
    margin-top: 40px;
    font-size: 14px;

    text-align: center;

    a {
      color: var(--color-warning);

      transition: 0.3s ease-in-out;

      &:hover {
        scale: 1.1;
        color: var(--color-text);
        animation: rotate 0.5s;
      }
    }
  }

  .error {
    display: flex;
    align-items: center;
    gap: 5px;

    font-size: 12px;
    color: var(--color-warning);
  }
}

@media (max-width: 1200px) {
  .auth {
    width: 40%;
  }
}

@media (max-width: 992px) {
  .auth {
    width: 60%;
  }
}
</style>
