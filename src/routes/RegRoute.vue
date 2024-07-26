<script setup>
import {useRouter} from 'vue-router';
import {onMounted, ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import {PenSquare, Repeat2, User, UserPen} from 'lucide-vue-next';

import {notification} from '@/lib/toastService';
import Loader from '@/shared/Loader.vue';
import {useUserStore} from '@/store/user';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const name = ref('');
const password = ref('');
const repassword = ref('');

const loader = ref(true);
const error = ref(false);

const regex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-]).+$/;

const shake = message => {
  notification(message, 'warning', 2000);

  const timeout = setTimeout(() => {
    error.value = false;
  }, 500);

  return () => clearTimeout(timeout);
};

const regUser = async () => {
  if (
    username.value === '' ||
    password.value === '' ||
    name.value === '' ||
    repassword.value === ''
  ) {
    error.value = true;
    shake('Some fields are empty');
    return;
  }

  if (
    !/^[a-zA-Z0-9 ]*$/.test(username.value) ||
    !/^[a-zA-Z0-9 ]*$/.test(name.value)
  ) {
    error.value = true;
    shake('Username must contain only English letters, digits, and spaces');
    return;
  }

  if (!regex.test(password.value)) {
    error.value = true;
    shake('Password must contain letters, digits, and specials character');
    return;
  }

  if (password.value !== repassword.value) {
    error.value = true;
    shake('Passwords must be the same');
    return;
  }

  const data = {
    id: uuidv4(),
    usernameReq: username.value,
    name: name.value,
    password: password.value,
  };

  const success = await userStore.register(data);

  if (success === '404') {
    notification('User already exists', 'warning', 2000);
    return;
  } else if (!success) {
    notification('Failed to register', 'warning', 2000);
    router.push('/vue-todo.v2/404');
  } else {
    router.push('/vue-todo.v2/');
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
      <form v-show="!loader" class="reg" @submit.prevent="regUser">
        <h2>Create account in<br />#TaskList</h2>

        <div class="userInfo">
          <div class="item">
            <User :size="20" />
            <input v-model="username" type="text" placeholder="Username" />
          </div>

          <div class="item">
            <UserPen :size="20" />
            <input v-model="name" type="text" placeholder="Name" />
          </div>
        </div>

        <div class="item">
          <PenSquare :size="20" />
          <input v-model="password" type="password" placeholder="Password" />
        </div>

        <div class="item">
          <Repeat2 :size="20" />
          <input
            v-model="repassword"
            type="password"
            placeholder="Repeat password"
          />
        </div>

        <button type="submit" :class="{shake: error}">Sign up</button>

        <div class="login">
          Already have an account? <a href="/vue-todo.v2/auth">Sign in</a>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.reg {
  width: 20%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;

  gap: 10px;

  h2 {
    font-size: 30px;

    text-align: center;
  }

  .userInfo {
    width: 100%;
    display: flex;
    align-items: center;

    gap: 20px;
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

      color: var(--color-text);
      background-color: transparent;
      border: none;
      outline: none;
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

  .login {
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
}

@media (max-width: 1500px) {
  .reg {
    width: 40%;
  }
}

@media (max-width: 992px) {
  .reg {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .reg {
    width: 80%;
  }
}
</style>
