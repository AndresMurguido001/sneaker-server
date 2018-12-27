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
    Cart:{
        items: async ({ id }, args, { models }, info) => {
            let shoes = await models.Shoe.findAll({ where: { cartId: id }})
            return shoes
        }
    },
    Mutation: {
        findOrCreateCart: async (parent, args, {models, userId}, info) => {
            const cart = await models.sequelize.transaction(async (transaction) => {
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
                cart,
                error: null
            }
                
            },
        
        addItem: async ({ id }, args, { models, userId }, info) => {
            const newItem = await models.Shoe.findOne({
                where: {
                    shoeId: args.shoeId,
                }
            })
           
            if (!newItem) {
                return false;
            }
            newItem.update({
                cartId: id
            })
            await pubsub.publish(NEW_ITEM_ADDED, {
                shoe: newItem
            })
            return true
        }
    }
}