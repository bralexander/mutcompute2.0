import buzz
import flask
import functools
import http
import warnings


class FlaskBuzz(buzz.Buzz):

    # These are the values that should be used by default when this
    # exception is handled by a flask error handler
    status_code = http.HTTPStatus.BAD_REQUEST
    headers = None

    def __str__(self):
        return "{super_str} ({status_code})".format(
            super_str=super().__str__(),
            status_code=self.status_code,
        )

    def jsonify(self, status_code=None, message=None, headers=None):
        """
        Returns a representation of the error in a jsonic form that is
        compatible with flask's error handling.

        Keyword arguments allow custom error handlers to override parts of the
        exception when it is jsonified
        """
        if status_code is None:
            status_code = self.status_code
        if message is None:
            message = self.message
        if headers is None:
            headers = self.headers
        response = flask.jsonify({
            'status_code': status_code,
            'error': repr(self),
            'message': message,
        })
        if status_code is not None:
            response.status_code = status_code
        if headers is not None:
            response.headers = headers
        return response

    @staticmethod
    def build_error_handler(*tasks):
        """
        Provides a generic error function that packages a flask_buzz exception
        so that it can be handled nicely by the flask error handler::

            app.register_error_handler(
                FlaskBuzz, FlaskBuzz.build_error_handler(),
            )

        Additionally, extra tasks may be applied to the error prior to
        packaging::

            app.register_error_handler(
                FlaskBuzz,
                build_error_handler(print, lambda e: foo(e)),
            )

        This latter example will print the error to stdout and also call the
        foo() function with the error prior to packaing it for flask's handler
        """

        def _handler(error, tasks=[]):
            [t(error) for t in tasks]
            return error.jsonify(), error.status_code, error.headers

        return functools.partial(_handler, tasks=tasks)

    @staticmethod
    def build_error_handler_for_flask_restplus(*tasks):
        """
        Provides a generic error function that packages a flask_buzz exception
        so that it can be handled by the flask-restplus error handler::

            @api.errorhandler(SFBDError)
            def do_it(error):
                return SFBDError.build_error_handler_for_flask_restplus()()

        or::

            api.errorhandler(SFBDError)(
                SFBDError.build_error_handler_for_flask_restplus()
            )

        Flask-restplus handles exceptions differently than Flask, and it is
        awkward. For further reading on why special functionality is needed for
        flask-restplus, observe and compare:

            * http://flask.pocoo.org/docs/0.12/patterns/apierrors/
            * http://flask-restplus.readthedocs.io/en/stable/errors.html#

        Additionally, extra tasks may be applied to the error prior to
        packaging as in ``build_error_handler``
        """
        def _handler(error, tasks=[]):
            [t(error) for t in tasks]
            response = error.jsonify()
            return flask.json.loads(response.get_data()), response.status_code

        return functools.partial(_handler, tasks=tasks)

    @classmethod
    def register_error_handler_with_flask_restplus(cls, api, *tasks):
        """
        Registers an error handler for FlaskBuzz derived errors that are
        currently imported. This is useful since flask-restplus
        (prior to 0.11.0) does not handle derived errors. This is probably the
        easist way to register error handlers for FlaskBuzz errors with
        flask-restplus::

            FlaskBuzz.register_error_handler_with_flask_restplus(
                api, print, lambda e: foo(e),
            )
        """

        for buzz_subclass in [cls] + cls.__subclasses__():
            api.errorhandler(buzz_subclass)(
                cls.build_error_handler_for_flask_restplus(*tasks)
            )


def error_handler(error):
    """
    **Deprecated**: Use build_error_handler
    """
    warnings.warn(
        "error_handler is deprecated. use build_error_handler instead",
        DeprecationWarning,
    )
    return error.jsonify()
