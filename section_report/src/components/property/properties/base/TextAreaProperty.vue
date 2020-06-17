<template>
  <div class="uk-flex uk-flex-top th-property">
    <div class="th-label">
      {{ label }}
    </div>
    <div class="uk-flex uk-width-expand">
      <textarea
        type="text"
        class="uk-textarea"
        :value="value"
        @change="change($event.target.value)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TextAreaProperty',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    change (value: string) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped>
.th-property {
  padding-top: 5px;
}

.th-label {
  font-size: 0.8rem;
  width: 100px;
}

textarea {
  font-size: 0.8rem;
  resize: vertical;
}
</style>
