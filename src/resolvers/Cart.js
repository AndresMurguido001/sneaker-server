import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../pubsub";

const NEW_ITEM_ADDED = "NEW_ITEM_ADDED"

export default {
    Subscription: {
        newItemAdded: {
            subscribe: withFilter(
                (parent, args, context) => {
                    return pubsub.asyncIterator(NEW_ITEM_ADDED);
                },
                (payload, variables) => payload.cartId === variables.cartId
            )
        }
    },
    Mutation: {
        findOrCreateCart: async (parent, args, {models, userId}, info) => {
            const cart = await models.sequelize.transaction(async transaction => {
                const currentCart = await models.Cart.findOrCreate({ 
                    where: { 
                        userId: args.userId
                    },
                    defaults: {
                        userId: args.userId
                    },
                    transaction
                })
                .spread((cart, created) => {
                    console.log("CART: ", cart)
                    console.log("CREATED: ", created)
                })

            })
            return {
                ok: true,
                shoes: null,
                error: null
            }
                
            },
        
        addItem: async (parent, args, context, info) => {
            let newItem = await models.Shoe.findOne({
                where: {
                    shoeId: args.shoeId
                }
            })
            if (!newItem) {
                return false
            }
            await pubsub.publish(NEW_ITEM_ADDED, {
                shoeId: args.shoeId
            })
            return true
        }
    }
}