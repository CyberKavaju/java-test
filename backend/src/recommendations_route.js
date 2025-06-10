// Get Java documentation links for recommendations
app.get('/api/recommendations', async (req, res) => {
    try {
        const recommendations = await db.getRecommendations();
        res.json({
            success: true,
            recommendations
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recommendations'
        });
    }
});
