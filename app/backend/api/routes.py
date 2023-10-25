from app.backend.api import *
from app.backend.api.game_controller import GameController

from flask_restful import Resource, request


class GamesResource(Resource):
    def get(self):
        return GameController.get_all_games()

    def post(self):
        return GameController.create_new_game()


class GameDetails(Resource):
    def get(self, game_id):
        return GameController.get_game_by_id(game_id)


class StartGame(Resource):
    def put(self, game_id):
        return GameController.start_game(game_id)


class IsValidPosition(Resource):
    def get(self, game_id, row, col):
        return GameController.is_valid_position(game_id, row, col)

api.add_resource(GamesResource, '/')
api.add_resource(GameDetails, '/<int:game_id>')     # get details of a game by its id
api.add_resource(StartGame, '/start_game/<int:game_id>')
api.add_resource(IsValidPosition,
                 '/is_valid_position/<int:game_id>/<int:row>/<int:col>')  # get info on a position of a game with its id
