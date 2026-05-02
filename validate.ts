async function test() {
  const { getUnifiedRecipeSchema } = await import('./src/services/geminiService.ts');
  console.log(JSON.stringify(getUnifiedRecipeSchema(), null, 2));
}
test();
