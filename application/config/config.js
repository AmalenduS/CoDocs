module.exports = {
  db: {
    // str: 'mongodb://127.0.0.1:27017/docTrace',
    str: process.env.DOCTRACE_MONGO_URL,
    options: {
      auto_reconnect: true,
      reconnectTries: Number.MAX_SAFE_INTEGER,
      poolSize: 200,
      useNewUrlParser: true,
      readPreference: 'primaryPreferred',
    },
  },
  sendGrid: {
    auth: {
        api_key: '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'
    }
  },
  mailSendFrom: 'noreply@doctrace.com',
  congnito: {
    pool_id: 'us-east-1_6ei5noHCt',
    pool_ARN: 'arn:aws:cognito-idp:us-east-1:840401781841:userpool/us-east-1_6ei5noHCt',
    client_id: '76dvmjlham8kndg5ft9npstcfv',
    pool_region: 'us-east-1'
  }
};
