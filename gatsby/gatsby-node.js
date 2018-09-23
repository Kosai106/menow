const firebase = require('firebase-admin');
const path = require('path');

const templatePath = path.resolve('src/templates/template.tsx');

const firestore = new firebase.firestore.Firestore({
  timestampsInSnapshots: true,
  projectId: 'menow-41053',
  keyFilename: './service-account.json',
});

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  return new Promise((res, rej) => {
    firestore.collection('users')
      .stream()
      .on('data', async user => {
        try {
          const stati = await firestore.collection('users')
            .doc(user.id)
            .collection('current_status')
            .get();

          const userDoc = user.data();

          createPage({
            path: `/${userDoc.slug}`,
            component: templatePath,
            context: {
              statuses: stati.docs.map(stat => ({
                ...stat.data(),
                type: stat.id,
              })),
              user: userDoc,
            },
          });
        } catch (err) {
          rej(err);
        }
      })
      .on('error', rej)
      .on('end', res);
  });
};

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage !== 'develop') {
    return;
  }

  actions.setWebpackConfig({ devtool: 'source-map' });
};
