import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'

const FormInversion = () => {
    return (
        <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-medium">Inversión</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-3 sm:gap-4">
                        <div className="flex flex-col space-y-1 sm:space-y-1.5">
                            <Label htmlFor="amount" className="text-xs sm:text-sm">Monto</Label>
                            <Input
                                id="amount"
                                placeholder="Ingrese monto"
                                type="number"
                                inputMode="decimal"
                                className="h-8 sm:h-10 text-sm"
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default FormInversion
