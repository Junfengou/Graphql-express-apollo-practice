const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
	GraphQLSchema,
} = require("graphql");
const Axios = require("axios");

//LaunchType

const LaunchType = new GraphQLObjectType({
	name: "Launch",
	fields: () => ({
		flight_number: { type: GraphQLInt },
		mission_name: { type: GraphQLString },
		launch_year: { type: GraphQLString },
		launch_date_local: { type: GraphQLString },
		launch_success: { type: GraphQLBoolean },
		rocket: { type: RocketType },
	}),
});

const RocketType = new GraphQLObjectType({
	name: "Rocket",
	fields: () => ({
		rocket_id: { type: GraphQLString },
		rocket_name: { type: GraphQLString },
		rocket_type: { type: GraphQLString },
	}),
});

//RootQuery

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		//grab list of items
		launches: {
			type: new GraphQLList(LaunchType),
			resolve(parents, args) {
				return Axios.get("https://api.spacexdata.com/v3/launches").then(
					(res) => res.data
				);
			},
		},
		//grab single item
		launch: {
			type: LaunchType,
			args: {
				flight_number: { type: GraphQLInt },
			},
			resolve(parents, args) {
				return Axios.get(
					`https://api.spacexdata.com/v3/launches/${args.flight_number}`
				).then((res) => res.data);
			},

			rockets: {
				type: new GraphQLList(RocketType),
				resolve(parents, args) {
					return Axios.get("https://api.spacexdata.com/v3/rockets").then(
						(res) => res.data
					);
				},
			},
		},

		//grab list of items
		rockets: {
			type: new GraphQLList(RocketType),
			resolve(parents, args) {
				return Axios.get("https://api.spacexdata.com/v3/rockets").then(
					(res) => res.data
				);
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
