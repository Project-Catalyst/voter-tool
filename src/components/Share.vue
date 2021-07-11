<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ $t('share.SHARE_PICK_LIST') }}</p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">
      <p v-html="$t('share.SHARE_INTRO')"></p>
      <p v-html="$t('share.CHOOSE_COPY_PASSWORD')" v-if="false"></p>
      <b-field label="Password" v-if="false">
        <b-input
          type="password"
          :value="password"
          password-reveal
          :placeholder="$t('share.CHOOSE_PASSWORD')"
          required>
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        @click="share"
        :label="$t('share.SHARE')"
        type="is-primary" />
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ShareAPI from '@/api/share.js';

export default {
  data() {
    return {
      password: '',
      characters: 'a-z,A-Z,0-9,#',
      size: 16
    }
  },
  computed: {
    ...mapState({
      pchallenges: (state) => state.proposals.challenges,
      downChallenges: (state) => state.proposals.downChallenges,
      rationales: (state) => state.proposals.rationales,
      shareTitle: (state) => state.proposals.title
    }),
    challengesToShare() {
      let challenges = []
      let keys = [...Object.keys(this.pchallenges), ...Object.keys(this.downChallenges)]
      keys = [...new Set(keys)];
      keys.forEach((k) => {
        let challenge = { 'challenge_id': k }
        if (this.pchallenges[k]) {
          challenge.proposals = this.pchallenges[k].map((p) => p.id).join()
        }
        if (this.downChallenges[k]) {
          challenge.downProposals = this.downChallenges[k].map((p) => p.id).join()
        }
        if (this.rationales[k]) {
          challenge.rationale = this.rationales[k]
        }
        challenges.push(challenge)
      })
      return challenges
    },
    toShare() {
      return {
        title: this.shareTitle,
        challenges: this.challengesToShare,
        password: this.password
      }
    }
  },
  methods: {
    generate() {
      let charactersArray = this.characters.split(',');
      let CharacterSet = '';
      let password = '';
      if( charactersArray.indexOf('a-z') >= 0) {
        CharacterSet += 'abcdefghijklmnopqrstuvwxyz';
      }
      if( charactersArray.indexOf('A-Z') >= 0) {
        CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      }
      if( charactersArray.indexOf('0-9') >= 0) {
        CharacterSet += '0123456789';
      }
      if( charactersArray.indexOf('#') >= 0) {
        CharacterSet += '![]{}()%&*$#^<>~@|';
      }
      for(let i=0; i < this.size; i++) {
        password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length));
      }
      this.password = password;
    },
    share() {
      ShareAPI.share(this.toShare).then((r) => {
        this.$emit('close')
        this.$buefy.dialog.alert({
          title: this.$t('share.PICK_LIST_SAVED'),
          message: `${this.$t('share.PICK_LIST_SAVED_MSG')}<br /><b><a href="https://cardanocataly.st/voter-tool/#/f5/shared/${r.data.pick_list.uuid}" target="_blank">https://cardanocataly.st/voter-tool/#/f5/shared/${r.data.pick_list.uuid}</a></b>`,
          confirmText: 'OK'
        })
      })
    }
  },
  mounted() {
    this.generate()
  }
}

</script>
