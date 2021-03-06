import React, { Fragment, Link } from 'react';
import './AdminPanel.scss';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';

const GET_TRANSACTIONS = gql`
    {
        transactions {
            id
            quantity
            user_id
            date
            product_id
            currency
            status
            owner_user_id
        }
    }
`;

const SHIP_DELIVERY_TRANSACTIONS = gql`
    mutation ship_delivery_transaction(
        $transaction_id: String!
        $new_status: String!
    ) {
        ship_delivery_transaction(
            transaction_id: $transaction_id

            new_status: $new_status
        ) {
            id
            quantity
            user_id
            product_id
            date
            currency
            status
        }
    }
`;

const GET_TRANSACTIONS_OF_MY_PRODUCTS = gql`
    query user_my_products_transactions($owner_user_id: String!) {
        user_my_products_transactions(user_id: $owner_user_id) {
            id
            user_id
            status
            quantity
            product_id
            owner_user_id
            date
            currency
        }
    }
`;

const GET_PRODUCTS = gql`
    {
        products {
            id
            price
            stock
            name
            owner_user_id
        }
    }
`;

const GET_PRODUCTS_OWNED_BY_ME = gql`
    query products_owned_by_me($user_id: String!) {
        products_owned_by_me(user_id: $user_id) {
            id
            name
            price
            stock
            owner_user_id
        }
    }
`;

const GET_USER_NAME = gql`
    query user($id: String!) {
        user(id: $id) {
            userName
            address {
                country
                fullName
                mobileNo
                pinCode
                streetAddress
                state
                default
            }
        }
    }
`;

const GET_PRODUCT_NAME = gql`
    query product($id: String!) {
        product(id: $id) {
            name
            price
        }
    }
`;

const DELETE_PRODUCT = gql`
    query deleteproduct($id: String!) {
        deleteproduct(id: $id) {
            id
            name
            price
            stock
        }
    }
`;

function parseJWT(token) {
    if (!token) {
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

const uid = localStorage.getItem('CUR_USER');

const AdminPanel = () => {
    const authToken = localStorage.getItem('AUTH_TOKEN');
    console.log('authtoken===', authToken);
    var tokendata = parseJWT(authToken);
    if (tokendata && tokendata.userType)
        console.log('usrType', tokendata.userType);

    return (
        <Fragment>
            {tokendata && tokendata.userType === 'admin' ? (
                <Fragment>
                    <Query
                        query={GET_TRANSACTIONS_OF_MY_PRODUCTS}
                        variables={{
                            owner_user_id: uid,
                        }}
                    >
                        {({ data: dat }) => (
                            <Fragment>
                                <h1>Transactions</h1>
                                <table className="admintable">
                                    <tbody>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>User ID</th>
                                            <th>User Name</th>
                                            <th>Address</th>
                                            <th>Product</th>
                                            <th>Price</th>
                                            {/* <th>Product ID</th> */}
                                            <th>Quantity</th>
                                            <th>Date</th>
                                            <th>currency</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dat &&
                                            dat.user_my_products_transactions &&
                                            dat.user_my_products_transactions.map(
                                                (transaction) => (
                                                    <tr>
                                                        <td>
                                                            {transaction.id}
                                                        </td>
                                                        <td>
                                                            {
                                                                transaction.user_id
                                                            }
                                                        </td>

                                                        <Fragment>
                                                            <Query
                                                                query={
                                                                    GET_USER_NAME
                                                                }
                                                                variables={{
                                                                    id:
                                                                        transaction.user_id,
                                                                }}
                                                            >
                                                                {({
                                                                    data: userdata,
                                                                }) => (
                                                                    <Fragment>
                                                                        {userdata &&
                                                                            userdata.user && (
                                                                                <Fragment>
                                                                                    <td>
                                                                                        {
                                                                                            userdata
                                                                                                .user
                                                                                                .userName
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {userdata
                                                                                            .user
                                                                                            .address[0]
                                                                                            .streetAddress +
                                                                                            ' ' +
                                                                                            userdata
                                                                                                .user
                                                                                                .address[0]
                                                                                                .state +
                                                                                            ' ' +
                                                                                            userdata
                                                                                                .user
                                                                                                .address[0]
                                                                                                .country}
                                                                                    </td>
                                                                                </Fragment>
                                                                            )}
                                                                    </Fragment>
                                                                )}
                                                            </Query>
                                                        </Fragment>

                                                        <Fragment>
                                                            <Query
                                                                query={
                                                                    GET_PRODUCT_NAME
                                                                }
                                                                variables={{
                                                                    id:
                                                                        transaction.product_id,
                                                                }}
                                                            >
                                                                {({
                                                                    data: productdata,
                                                                }) =>
                                                                    console.log(
                                                                        'userd::',
                                                                        productdata,
                                                                    ) || (
                                                                        <Fragment>
                                                                            {productdata &&
                                                                            productdata.product ? (
                                                                                <Fragment>
                                                                                    <td>
                                                                                        {
                                                                                            productdata
                                                                                                .product
                                                                                                .name
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {productdata
                                                                                            .product
                                                                                            .price +
                                                                                            ' * ' +
                                                                                            transaction.quantity +
                                                                                            ' = ' +
                                                                                            productdata
                                                                                                .product
                                                                                                .price *
                                                                                                transaction.quantity}
                                                                                    </td>
                                                                                </Fragment>
                                                                            ) : (
                                                                                <Fragment>
                                                                                    <td>
                                                                                        Deleted
                                                                                        Product
                                                                                    </td>
                                                                                    <td>
                                                                                        Deleted
                                                                                        Product
                                                                                    </td>
                                                                                </Fragment>
                                                                            )}
                                                                        </Fragment>
                                                                    )
                                                                }
                                                            </Query>
                                                        </Fragment>

                                                        {/* <td>
                                                    {transaction.product_id}
                                                </td> */}
                                                        <td>
                                                            {
                                                                transaction.quantity
                                                            }
                                                        </td>
                                                        <td>
                                                            {transaction.date}
                                                        </td>
                                                        <td>
                                                            {
                                                                transaction.currency
                                                            }
                                                        </td>
                                                        <td>
                                                            {transaction.status}
                                                        </td>

                                                        <Mutation
                                                            mutation={
                                                                SHIP_DELIVERY_TRANSACTIONS
                                                            }
                                                        >
                                                            {(
                                                                ship_delivery_transaction,
                                                                {
                                                                    data,
                                                                    loading,
                                                                    error,
                                                                },
                                                            ) => {
                                                                return (
                                                                    <td>
                                                                        <button
                                                                            onClick={() => {
                                                                                ship_delivery_transaction(
                                                                                    {
                                                                                        variables: {
                                                                                            transaction_id:
                                                                                                transaction.id,
                                                                                            new_status:
                                                                                                'Shipped',
                                                                                        },
                                                                                    },
                                                                                ).then(
                                                                                    (
                                                                                        res,
                                                                                    ) => {
                                                                                        window.alert(
                                                                                            transaction.id +
                                                                                                ' is Shipped',
                                                                                        );

                                                                                        window.location.reload();
                                                                                    },
                                                                                );
                                                                            }}
                                                                        >
                                                                            Shipped
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                ship_delivery_transaction(
                                                                                    {
                                                                                        variables: {
                                                                                            transaction_id:
                                                                                                transaction.id,
                                                                                            new_status:
                                                                                                'Delivered',
                                                                                        },
                                                                                    },
                                                                                ).then(
                                                                                    (
                                                                                        res,
                                                                                    ) => {
                                                                                        window.alert(
                                                                                            transaction.id +
                                                                                                ' is Delivered',
                                                                                        );

                                                                                        window.location.reload();
                                                                                    },
                                                                                );
                                                                            }}
                                                                        >
                                                                            Delivered
                                                                        </button>
                                                                    </td>
                                                                );
                                                            }}
                                                        </Mutation>
                                                    </tr>
                                                ),
                                            )}
                                    </tbody>
                                </table>
                            </Fragment>
                        )}
                    </Query>

                    <Query
                        query={GET_PRODUCTS_OWNED_BY_ME}
                        variables={{
                            user_id: uid,
                        }}
                    >
                        {({ data, refetch }) =>
                            console.log('product_data===>>', data) || (
                                <Fragment>
                                    <h1>Products</h1>
                                    <table className="admintable">
                                        <tbody>
                                            <tr>
                                                <th>Product ID</th>
                                                <th>Product Owner</th>
                                                <th>Product Name</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Actions</th>
                                            </tr>
                                            {data &&
                                                data.products_owned_by_me &&
                                                data.products_owned_by_me.map(
                                                    (product) => (
                                                        <tr>
                                                            <td>
                                                                {product.id}
                                                            </td>
                                                            <td>
                                                                {
                                                                    product.owner_user_id
                                                                }
                                                            </td>
                                                            <td>
                                                                {product.name}
                                                            </td>
                                                            <td>
                                                                {product.price}
                                                            </td>
                                                            <td>
                                                                {product.stock}
                                                            </td>
                                                            <td>
                                                                <a>
                                                                    <button
                                                                        onClick={() => {
                                                                            localStorage.setItem(
                                                                                'EDIT_MODE',
                                                                                product.id,
                                                                            );

                                                                            localStorage.setItem(
                                                                                'PRODUCT_NAME',
                                                                                product.name,
                                                                            );
                                                                            localStorage.setItem(
                                                                                'PRODUCT_PRICE',
                                                                                product.price,
                                                                            );
                                                                            localStorage.setItem(
                                                                                'PRODUCT_STOCK',
                                                                                product.stock,
                                                                            );

                                                                            window.location =
                                                                                '/addoredit';
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </a>
                                                                <ApolloConsumer>
                                                                    {(
                                                                        client,
                                                                    ) => (
                                                                        <button
                                                                            onClick={async () => {
                                                                                const {
                                                                                    data,
                                                                                } = await client.query(
                                                                                    {
                                                                                        query: DELETE_PRODUCT,
                                                                                        variables: {
                                                                                            id:
                                                                                                product.id,
                                                                                        },
                                                                                    },
                                                                                );
                                                                                // to refresh the product table after the deletion.
                                                                                refetch();
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </ApolloConsumer>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                        </tbody>
                                    </table>
                                    <button
                                        onClick={() => {
                                            localStorage.setItem(
                                                'EDIT_MODE',
                                                'false',
                                            );
                                            window.location = '/AddorEdit';
                                        }}
                                    >
                                        Add Product
                                    </button>

                                    <button
                                        onClick={() => {
                                            localStorage.removeItem(
                                                'AUTH_TOKEN',
                                            );
                                            window.location = '/login-signup';
                                        }}
                                    >
                                        logout
                                    </button>
                                </Fragment>
                            )
                        }
                    </Query>
                </Fragment>
            ) : (
                <Fragment>
                    <h1>You don't have the access</h1>
                </Fragment>
            )}
        </Fragment>
        // <div>
        //     {authToken ? (
        //         <button
        //             onClick={() => {
        //                 localStorage.removeItem('AUTH_TOKEN');
        //                 window.location = '/';
        //             }}
        //         >
        //             logout
        //         </button>
        //     ) : (
        //         <Link to="/login-signup">login</Link>
        //     )}
        // </div>
    );
};

export default AdminPanel;
