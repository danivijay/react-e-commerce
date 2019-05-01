import React, { Fragment } from 'react';
import './AdminPanel.scss';
import { Query } from 'react-apollo';
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
        }
    }
`;

const GET_USER_NAME = gql`
    query user($id: String!) {
        user(id: $id) {
            userName
            address
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

const AdminPanel = () => {
    return (
        <Fragment>
            <Query query={GET_TRANSACTIONS}>
                {({ data: dat }) =>
                    console.log(dat) || (
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
                                    </tr>
                                    {dat &&
                                        dat.transactions &&
                                        dat.transactions.map((transaction) => (
                                            <tr>
                                                <td>{transaction.id}</td>
                                                <td>{transaction.user_id}</td>

                                                <Fragment>
                                                    <Query
                                                        query={GET_USER_NAME}
                                                        variables={{
                                                            id:
                                                                transaction.user_id,
                                                        }}
                                                    >
                                                        {({ data: userdata }) =>
                                                            console.log(
                                                                'userd::',
                                                                userdata,
                                                            ) || (
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
                                                                                    {
                                                                                        userdata
                                                                                            .user
                                                                                            .address
                                                                                    }
                                                                                </td>
                                                                            </Fragment>
                                                                        )}
                                                                </Fragment>
                                                            )
                                                        }
                                                    </Query>
                                                </Fragment>

                                                <Fragment>
                                                    <Query
                                                        query={GET_PRODUCT_NAME}
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
                                                                    productdata.product &&
                                                                    productdata
                                                                        .product
                                                                        .name ? (
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
                                                <td>{transaction.quantity}</td>
                                                <td>{transaction.date}</td>
                                                <td>{transaction.currency}</td>
                                                <td>{transaction.status}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </Fragment>
                    )
                }
            </Query>

            <Query query={GET_PRODUCTS}>
                {({ data }) =>
                    console.log(data) || (
                        <Fragment>
                            <h1>Products</h1>
                            <table className="admintable">
                                <tbody>
                                    <tr>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                    {data &&
                                        data.products &&
                                        data.products.map((product) => (
                                            <tr>
                                                <td>{product.id}</td>
                                                <td>{product.name}</td>
                                                <td>{product.price}</td>
                                                <td>{product.stock}</td>
                                                <td>
                                                    <a href="/addoredit">
                                                        <button>Add</button>
                                                    </a>
                                                    <ApolloConsumer>
                                                        {(client) => (
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
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </ApolloConsumer>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </Fragment>
                    )
                }
            </Query>
        </Fragment>
    );
};

export default AdminPanel;
