import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../comfig/FireBaseConfig';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Fetch cart items from Firestore
    const fetchCartItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Cart'));
            const cartData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCartItems(cartData);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Remove an item from cart
    const handleRemoveFromCart = async (id) => {
        try {
            await deleteDoc(doc(db, 'Cart', id));
            setCartItems(cartItems.filter(item => item.id !== id));
            Toast.show({
                type: 'success',
                text1: 'Removed',
                text2: 'Service removed from cart.',
            });
        } catch (error) {
            console.error('Error removing item:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove service from cart.',
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5D3FD3" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Cart</Text>
            {cartItems.length === 0 ? (
                <Text style={styles.emptyText}>No services added to cart.</Text>
            ) : (
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem}>
                            <Image source={{ uri: item.image }} style={styles.cartImage} />
                            <View style={styles.cartInfo}>
                                <Text style={styles.cartTitle}>{item.name}</Text>
                                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFromCart(item.id)}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#5D3FD3',
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    cartImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    cartInfo: {
        marginLeft: 10,
        flex: 1,
    },
    cartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        marginTop: 5,
        backgroundColor: '#FF3B30',
        padding: 6,
        borderRadius: 6,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
