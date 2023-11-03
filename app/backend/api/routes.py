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


class IsFreePosition(Resource):
    # /is_free_position/game_id?x=n1&y=n2
    def get(self, game_id):
        x = int(request.args.get('x'))
        y = int(request.args.get('y'))
        return GameController.is_free_position(game_id, x, y)


class SetAlterator(Resource):
    def put(self, game_id):
        data = request.json  # data is sent as JSON in the body of the petition
        return GameController.set_alterator(game_id, data)

      
class RefreshBoard(Resource):
    def put(self, game_id):
        return GameController.refresh_board(game_id)


class ActBoard(Resource):
    def put(self, game_id):
        return GameController.act_board(game_id)


class SpawnAliens(Resource):
    def put(self, game_id):
        return GameController.spawn_aliens(game_id)


class JoinAs(Resource):
    # /join/game_id?team=GREEN&player_name=pepitoIsOut
    def put(self, game_id):
        team = request.args.get('team')
        player_name = request.args.get('player_name')
        return GameController.join_as(game_id, team, player_name)

class Sse(Resource):
    def get(self, game_id):
        return GameController.sse(game_id)

api.add_resource(GamesResource, '/')
api.add_resource(GameDetails, '/<int:game_id>')                 # get details of a game by its id
api.add_resource(StartGame, '/start_game/<int:game_id>')        # launch initial crew and set status game as STARTED
api.add_resource(RefreshBoard, '/refresh_board/<int:game_id>')  # moves all aliens
api.add_resource(ActBoard, '/act_board/<int:game_id>')          # acts all aliens
api.add_resource(SpawnAliens, '/spawn_aliens/<int:game_id>')    # spawn of two aliens , one of each team in their areas
api.add_resource(JoinAs, '/join/<int:game_id>')                 # player joins to a game as blue or green player with his name
api.add_resource(IsFreePosition, '/is_free_position/<int:game_id>')  # get position info of a game with its id
api.add_resource(SetAlterator, '/set_alterator/<int:game_id>')  # set alterator on board of game with id
api.add_resource(Sse, '/sse/<int:game_id>')                     # server sent events for game with id