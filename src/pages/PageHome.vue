<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
    <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
      <div class="col">
        <q-input class="new-twitt" bottom-slots v-model="newTwittContent" placeholder="What's happening?" counter autogrow maxlength="280">
        <template v-slot:before>
          <q-avatar size="xl">
            <img src="https://cdn.quasar.dev/img/avatar5.jpg">
          </q-avatar>
        </template>
        </q-input>
      </div>

      <div class="col col-shrink">
        <q-btn @click="addNewTwitt" class="q-mb-lg" :disable="!newTwittContent" unelevated rounded color="primary" label="Twitt" no-caps/>
      </div>

  </div>
  <q-separator class="divider" size="10px" color="grey-2"/>

  <q-list separator>

        <transition-group appear enter-active-class="animated fadeIn slow" leave-active-class="animated fadeOut slow">
          <q-item class="twitt q-py-md" v-for="twitt in twitts" :key="twitt.id">


            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </q-item-section>


            <q-item-section>
              <q-item-label class="text-subtitle1"><strong>C. Blay </strong>
                <span class="text-grey-7">@cblay
                <br class="lt-md"/>  &bull; {{ twitt.date | relativeDate}}
                </span>
              </q-item-label>
              <q-item-label class="twitt-content text-body1">
              {{ twitt.content }}
              </q-item-label>
              <div class="row twitt-icons justify-between q-mt-sm">
                <q-btn flat round color="grey" size="sm" icon="far fa-comment" />
                <q-btn flat round color="grey" size="sm" icon="fas fa-retweet" />
                <q-btn flat round size="sm" @click="toggleLiked(twitt)" :color="twitt.liked ? 'pink' : 'grey'" :icon="twitt.liked? 'fas fa-heart' : 'far fa-heart'"/>
                <q-btn @click="deleteTwitt(twitt)" flat round color="grey" size="sm" icon="fas fa-trash" />
              </div>
            </q-item-section>

          </q-item>
        </transition-group>


      </q-list>



      </q-list>
</q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance} from 'date-fns'
export default {
  name: 'PageHome',
  data() {
    return {
      newTwittContent: '',
     twitts: [

      ]
    }
  },

  methods: {
    addNewTwitt() {
      let newTwitt = {
        content: this.newTwittContent,
        date: Date.now(),
        liked: false
      }
    //  this.twitts.unshift(newTwitt)
    // Add a new document with a generated id.
      db.collection('twitts').add(newTwitt)
      .then((docRef) => {
          console.log('Document written with ID: ', docRef.id)
      })
      .catch((error) => {
          console.error('Error adding document: ', error)
      })
      this.newTwittContent = ''
    },
    deleteTwitt(twitt) {
            db.collection('twitts').doc(twitt.id).delete().then(() => {
          console.log('Document successfully deleted!');
      }).catch((error) => {
          console.error('Error removing document: ', error);
      })
    },
    toggleLiked(twitt) {
        db.collection("twitts").doc(twitt.id).update({
            liked: !twitt.liked
        })
        .then(() => {
            console.log('Document successfully updated!');
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error);
        })
    }
  },

  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    db.collection('twitts').orderBy('date').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {

          let twittChange = change.doc.data()
          twittChange.id = change.doc.id
            if (change.type === 'added') {
                console.log('New twitt: ', twittChange)
                this.twitts.unshift(twittChange)
            }
            if (change.type === 'modified') {
                console.log("Modified twitt: ", twittChange)
                let index = this.twitts.findIndex(twitt => twitt.id === twittChange.id)
                Object.assign(this.twitts[index], twittChange)
            }
            if (change.type === 'removed') {
                console.log("Removed twitt: ", twittChange)
                let index = this.twitts.findIndex(twitt => twitt.id === twittChange.id)
                this.twitts.splice(index, 1)
            }
        })
    })
  }

}
</script>

<style lang="sass"
  .new-twitt
    textarea
    font-size: 19px
    line-height: 1.4
  .divider
    border-top: 1px solid
    border-bottom: 1px solid
    border-color: $grey-4
  .twitt-content
    white-space: pre-line
  .twitt-icons
    margin-left: -5px
  .twitt:not(:first-child)
    border-top: 1px solid rgba(0, 0, 0, 0.12)
</style>
