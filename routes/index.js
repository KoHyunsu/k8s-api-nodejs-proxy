var express = require('express');
var router = express.Router();
const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromFile('./config');
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

router.get('/nodes', (req, res, next) => {
  k8sApi.listNode().then((response) => {
    res.status(200).json(response.body.items);
  }).catch((error) => {
    res.status(500).send(error);
  })
});

router.get('/pods', (req, res, next) => {
  k8sApi.listPodForAllNamespaces().then((response) => {
    res.status(200).json(response.body.items);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

router.get('/pods/:name/:namespace', (req, res, next) => {
  k8sApi.readNamespacedPodLog(req.params.name, req.params.namespace).then(() => {
    res.status(200).json(response.body.items);
  }).catch((error) => {
    res.status(500).json(error.body);
  })
});

router.get('/health', (req, res, next) => {
  res.status(200).send("healthy");
});

module.exports = router;
