function (context, cb) {
        var assign;

        if (typeof context === 'function') {
          cb = context;
          context = {};
        }

        var promise;
        if (!cb) {
          ((assign = createPromiseCallback(), promise = assign.promise, cb = assign.cb));
        }

        run(context).catch(function (err) {
          rewriteErrorTrace(err, maps);
          cb(err);
        }).then(function (app) {
          if (app) {
            renderer.renderToString(app, context, function (err, res) {
              rewriteErrorTrace(err, maps);
              cb(err, res);
            });
          }
        });

        return promise
      }