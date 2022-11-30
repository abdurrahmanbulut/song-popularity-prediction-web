<template>
  <div>
    <button
      @click="isListen = !isListen"
      v-text="isListen ? 'stop' : 'start'"
    />

    <vue-listen-voice
      :listen="isListen"
      @textFromSpeech="textFromSpeech"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isListen: false,
    }
  },
  methods: {
    textFromSpeech (text) {
      console.log('textFromSpeech: ', text)
    }
  }
}
</script>